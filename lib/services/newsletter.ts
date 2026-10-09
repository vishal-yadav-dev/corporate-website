import { q } from "@/lib/db";
import { cuid } from "@/lib/id";
import { bad } from "@/lib/http";
import { mailFrom, sendMail, sortAddresses } from "@/lib/email";
import { DEFAULT_TEMPLATES, getTemplate, renderTemplate, type TemplateSlug } from "@/lib/email-templates";
import { joinFrame, splitFrame } from "@/lib/email-shell";
import { siteUrl } from "@/lib/jobs";

const htmlToText = (html: string) =>
  html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export async function history() {
  const rows = await q(
    "SELECT id, subject, sent_count, status, created_at FROM newsletters ORDER BY created_at DESC LIMIT 50"
  );
  const audience = await q<{ n: string }>("SELECT COUNT(*)::int AS n FROM subscribers WHERE status = 'active'");
  const staff = await q<{ n: string }>("SELECT COUNT(*)::int AS n FROM employees WHERE status = 'active'");
  return {
    newsletters: rows,
    activeSubscribers: Number(audience[0]?.n ?? 0),
    activeEmployees: Number(staff[0]?.n ?? 0),
    /* Shown in the composer, so the sender sees who the mail is from. */
    from: mailFrom(),
  };
}

/**
 * Send an email from the composer.
 *
 *  - `to`: "subscribers" | "employees" | "custom". A list audience is always
 *    blind-copied, so no subscriber sees another's address.
 *  - `recipients`: addresses typed by hand. These are shown in To.
 *  - `cc` / `bcc`: typed by hand, sent as Cc and Bcc.
 *  - `replyTo`: where a reply goes, if not the From address.
 *  - `test`: send only to `me` and keep it out of the history.
 *
 * `contentHtml` is wrapped in the newsletter template. A malformed address
 * stops the send and is named, rather than being dropped without a word.
 */
export async function send(input: Record<string, unknown>, me?: string) {
  const subject = String(input.subject ?? "").trim();
  const contentHtml = String(input.contentHtml ?? "").trim();
  if (!subject) throw bad("Subject is required.");
  if (contentHtml.length < 10) throw bad("Write some content first.");

  // Attachments: [{ filename, contentType, dataBase64 }]. Capped at ~7MB total.
  const rawAtt = Array.isArray(input.attachments) ? (input.attachments as Record<string, unknown>[]) : [];
  let attBytes = 0;
  const attachments = rawAtt.slice(0, 10).map((a) => {
    const content = Buffer.from(String(a.dataBase64 ?? ""), "base64");
    attBytes += content.length;
    return { filename: String(a.filename ?? "file"), content, contentType: a.contentType ? String(a.contentType) : undefined };
  });
  if (attBytes > 7 * 1024 * 1024) throw bad("Attachments exceed the 7MB total limit.");

  const audience = String(input.to ?? "subscribers");
  const test = input.test === true;

  const typed = sortAddresses(input.recipients);
  const ccIn = sortAddresses(input.cc);
  const bccIn = sortAddresses(input.bcc);
  const reply = sortAddresses(input.replyTo ? [input.replyTo] : []);
  const invalid = [...typed.bad, ...ccIn.bad, ...bccIn.bad, ...reply.bad];
  if (invalid.length) throw bad(`Not a valid email address: ${invalid.join(", ")}`);

  let list: string[] = [];
  if (audience === "subscribers") {
    list = (await q<{ email: string }>("SELECT email FROM subscribers WHERE status = 'active'")).map((r) => r.email);
  } else if (audience === "employees") {
    list = (await q<{ email: string }>("SELECT email FROM employees WHERE status = 'active'")).map((r) => r.email);
  }

  let to = typed.ok;
  let cc = ccIn.ok;
  let bcc = [...new Set([...list.map((e) => e.toLowerCase()), ...bccIn.ok])];
  if (test) {
    if (!me) throw bad("Your account has no email address to send a test to.");
    to = [me]; cc = []; bcc = [];
  }
  if (!to.length && !cc.length && !bcc.length) throw bad("Add at least one recipient.");

  /* Sent in the frame of the template it was started from, when that template
     has one; otherwise in the newsletter frame. Either way the message goes
     where the frame marks its body. */
  const frameSlug = String(input.frame ?? "");
  const own = frameSlug in DEFAULT_TEMPLATES ? splitFrame((await getTemplate(frameSlug as TemplateSlug)).html) : null;
  const wrapper = own ?? splitFrame((await getTemplate("newsletter")).html);
  const html = renderTemplate(
    wrapper ? joinFrame(wrapper, contentHtml) : contentHtml,
    { content: contentHtml, unsubscribe_url: `${siteUrl()}/` }
  );

  const result = await sendMail({
    to,
    cc,
    bcc,
    replyTo: reply.ok[0],
    subject: test ? `[Test] ${subject}` : subject,
    text: htmlToText(contentHtml),
    html,
    attachments: attachments.length ? attachments : undefined,
  });

  const status = result.ok ? (result.mode === "json" ? "skipped" : "sent") : "failed";
  if (!test) {
    await q(
      "INSERT INTO newsletters (id, subject, html, sent_count, status) VALUES ($1,$2,$3,$4,$5)",
      [cuid(), subject, html, result.accepted.length, status]
    );
  }

  return {
    ok: result.ok,
    mode: result.mode,
    sent: result.accepted.length,
    note: result.mode === "json"
      ? "SMTP isn't configured, so the email was composed but not delivered. Set SMTP_* env vars to send for real."
      : undefined,
    error: result.error,
  };
}
