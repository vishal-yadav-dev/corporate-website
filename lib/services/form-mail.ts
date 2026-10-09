import { q } from "@/lib/db";
import { bad } from "@/lib/http";
import { sendMail, sortAddresses } from "@/lib/email";
import { escapeHtml, getTemplate, mailBaseUrl, renderTemplate, type TemplateSlug } from "@/lib/email-templates";

/**
 * Mail sent because someone filled in a form on the site: a notification to
 * the team, and an acknowledgement to the person who wrote in.
 *
 * Who the team notification goes to is a setting, not a constant. It is kept in
 * the `content` table under notify.<form>, edited in Admin → Email → Form
 * notifications, so the client can redirect a form without a deploy.
 */
export const NOTIFY_FORMS = [
  { key: "contact", label: "Talk to an Expert and contact forms", fallback: ["anuj@noblesoft.com"] },
  { key: "application", label: "Job applications", fallback: [] as string[] },
  { key: "resume", label: "Resume drop (no specific role)", fallback: [] as string[] },
] as const;

export type NotifyForm = (typeof NOTIFY_FORMS)[number]["key"];

const contentKey = (form: string) => `notify.${form}`;

/** The addresses stored for each form, or its built-in default. */
export async function getNotifySettings() {
  const rows = await q<{ key: string; value: string }>("SELECT key, value FROM content WHERE key LIKE 'notify.%'");
  const stored = new Map(rows.map((r) => [r.key, r.value]));
  return NOTIFY_FORMS.map((f) => {
    const raw = stored.get(contentKey(f.key));
    return {
      key: f.key,
      label: f.label,
      recipients: raw === undefined ? [...f.fallback] : sortAddresses(raw).ok,
    };
  });
}

export async function saveNotifySettings(input: Record<string, unknown>) {
  const forms = (input.forms ?? {}) as Record<string, unknown>;
  for (const f of NOTIFY_FORMS) {
    if (!(f.key in forms)) continue;
    const { ok, bad: invalid } = sortAddresses(forms[f.key]);
    if (invalid.length) throw bad(`Not a valid email address: ${invalid.join(", ")}`);
    await q(
      `INSERT INTO content (key, value) VALUES ($1,$2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [contentKey(f.key), ok.join(", ")]
    );
  }
  return { ok: true, forms: await getNotifySettings() };
}

/* A form with nobody listed still has to reach someone, so it falls back to
   every admin account — which is what job applications did before this. */
async function teamFor(form: NotifyForm): Promise<string[]> {
  const set = (await getNotifySettings()).find((f) => f.key === form);
  if (set?.recipients.length) return set.recipients;
  const admins = await q<{ email: string }>("SELECT email FROM admins");
  return sortAddresses(admins.map((a) => a.email)).ok;
}

const htmlToText = (html: string) =>
  html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|tr|h1|h2)>/gi, "\n")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n\n").trim();

/** What a visitor typed, made safe for an HTML body. Empty shows as a dash. */
const safe = (v: string | null | undefined) => (v && v.trim() ? escapeHtml(v.trim()).replace(/\n/g, "<br/>") : "—");
/** The same value for a subject line, which is plain text and one line. */
const plain = (v: string | null | undefined) => (v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, 120);
const firstName = (name: string) => plain(name).split(/\s+/)[0] || "there";

async function deliver(
  slug: TemplateSlug,
  mail: { to: string[]; replyTo?: string },
  html: Record<string, string>,
  subject: Record<string, string>
) {
  if (!mail.to.length) return;
  const tpl = await getTemplate(slug);
  const body = renderTemplate(tpl.html, html);
  await sendMail({
    to: mail.to,
    /* Explicit addressing: colleagues on a notification see each other. */
    bcc: [],
    replyTo: mail.replyTo,
    subject: renderTemplate(tpl.subject, subject),
    text: htmlToText(body),
    html: body,
  });
}

/* Each of these runs after the submission is already saved, and none of them
   may fail it: a mail server having a bad minute must not lose an enquiry or
   tell a candidate their application did not go through. */
async function quietly(what: string, jobs: Promise<void>[]) {
  for (const r of await Promise.allSettled(jobs)) {
    if (r.status === "rejected") console.error(`[form-mail] ${what} failed:`, r.reason);
  }
}

export async function leadReceived(lead: {
  name: string; email: string; company: string | null; phone: string | null; practice: string | null; message: string;
}) {
  const admin_url = `${mailBaseUrl()}/admin/leads`;
  await quietly("enquiry mail", [
    (async () => deliver(
      "lead-notify",
      { to: await teamFor("contact"), replyTo: lead.email },
      {
        name: safe(lead.name), email: escapeHtml(lead.email), company: safe(lead.company), phone: safe(lead.phone),
        practice: safe(lead.practice), message: safe(lead.message), admin_url,
      },
      { name: plain(lead.name) }
    ))(),
    /* The acknowledgement carries the sender's first name and nothing else
       they typed. Echoing the message back would let the form be used to mail
       arbitrary text to any address someone cared to enter. */
    deliver("contact-ack", { to: [lead.email] }, { name: escapeHtml(firstName(lead.name)) }, { name: firstName(lead.name) }),
  ]);
}

export async function applicationReceived(app: {
  name: string; email: string; phone: string | null; location: string | null;
  linkedinUrl: string | null; coverNote: string | null; jobTitle: string;
}) {
  const forRole = Boolean(app.jobTitle);
  const role = app.jobTitle || "General application (resume drop)";
  const admin_url = `${mailBaseUrl()}/admin/applications`;
  await quietly("application mail", [
    (async () => deliver(
      "application-notify",
      { to: await teamFor(forRole ? "application" : "resume"), replyTo: app.email },
      {
        name: safe(app.name), email: escapeHtml(app.email), phone: safe(app.phone), location: safe(app.location),
        linkedin: safe(app.linkedinUrl), job_title: escapeHtml(role), note: safe(app.coverNote), admin_url,
      },
      { name: plain(app.name), job_title: plain(role) }
    ))(),
    forRole
      ? deliver(
          "application-ack", { to: [app.email] },
          { name: escapeHtml(firstName(app.name)), job_title: escapeHtml(app.jobTitle) },
          { name: firstName(app.name), job_title: plain(app.jobTitle) }
        )
      : deliver("resume-ack", { to: [app.email] }, { name: escapeHtml(firstName(app.name)) }, { name: firstName(app.name) }),
  ]);
}
