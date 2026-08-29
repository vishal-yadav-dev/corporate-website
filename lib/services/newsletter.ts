import { q } from "@/lib/db";
import { cuid } from "@/lib/id";
import { bad } from "@/lib/http";
import { sendMail } from "@/lib/email";
import { getTemplate, renderTemplate } from "@/lib/email-templates";
import { siteUrl } from "@/lib/jobs";

const htmlToText = (html: string) =>
  html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export async function history() {
  const rows = await q(
    "SELECT id, subject, sent_count, status, created_at FROM newsletters ORDER BY created_at DESC LIMIT 50"
  );
  const audience = await q<{ n: string }>("SELECT COUNT(*)::int AS n FROM subscribers WHERE status = 'active'");
  return { newsletters: rows, activeSubscribers: Number(audience[0]?.n ?? 0) };
}

/**
 * Send a newsletter. `to`:
 *  - "subscribers": all active newsletter subscribers (BCC)
 *  - "employees": all active employees (BCC)
 *  - explicit array of addresses
 * `cc` / `bcc` are extra addresses. `contentHtml` is wrapped in the newsletter template.
 */
export async function send(input: Record<string, unknown>) {
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
  let recipients: string[] = [];
  if (audience === "subscribers") {
    recipients = (await q<{ email: string }>("SELECT email FROM subscribers WHERE status = 'active'")).map((r) => r.email);
  } else if (audience === "employees") {
    recipients = (await q<{ email: string }>("SELECT email FROM employees WHERE status = 'active'")).map((r) => r.email);
  } else if (Array.isArray(input.recipients)) {
    recipients = (input.recipients as unknown[]).map(String);
  }
  const cc = Array.isArray(input.cc) ? (input.cc as unknown[]).map(String).filter(Boolean) : [];
  const bcc = Array.isArray(input.bcc) ? (input.bcc as unknown[]).map(String).filter(Boolean) : [];
  recipients = [...new Set([...recipients, ...bcc])].filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

  if (!recipients.length && !cc.length) throw bad("No valid recipients.");

  const tpl = await getTemplate("newsletter");
  const html = renderTemplate(tpl.html, {
    content: contentHtml,
    unsubscribe_url: `${siteUrl()}/`,
  });

  const result = await sendMail({
    to: recipients.length ? recipients : cc,
    cc,
    subject,
    text: htmlToText(contentHtml),
    html,
    attachments: attachments.length ? attachments : undefined,
  });

  const status = result.ok ? (result.mode === "json" ? "skipped" : "sent") : "failed";
  await q(
    "INSERT INTO newsletters (id, subject, html, sent_count, status) VALUES ($1,$2,$3,$4,$5)",
    [cuid(), subject, html, result.accepted.length, status]
  );

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
