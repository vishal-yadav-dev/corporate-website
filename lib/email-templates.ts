import { q, one } from "@/lib/db";
import { SOCIAL_LINKS } from "@/lib/data";
import { BODY_START, BODY_END } from "@/lib/email-shell";

/**
 * Editable transactional email templates. Defaults live here; admins can override
 * subject + HTML from /admin/email-templates. Placeholders use {{name}} syntax.
 */

export type TemplateSlug =
  | "contact-ack" | "application-ack" | "resume-ack"
  | "lead-notify" | "application-notify"
  | "admin-invite" | "password-reset" | "newsletter";

export type TemplateDef = {
  slug: TemplateSlug;
  name: string;
  subject: string;
  html: string;
  /** placeholder -> human hint, shown in the editor */
  vars: Record<string, string>;
};

/* ------------------------------------------------------------------ *
 * The frame every email shares: the site's header band and its footer.
 *
 * Tables and inline styles throughout, because that is what mail clients
 * render — Outlook ignores flexbox and most strip <style>. Images are
 * addressed through {{site_url}}, which is filled in at send time, so the same
 * stored template works on any domain the site is deployed to.
 * ------------------------------------------------------------------ */

const BRAND = "Testsoft";
const FONT = "font-family:Inter,'Segoe UI',Arial,sans-serif";
const INK = "#16202B";
const MUTED = "#5C6A78";
const ORANGE = "#F1531E";

/* The message cell carries the type styles, so text the editor adds without
   styles of its own still inherits the right face, size and colour. */
const BODY_TD = `padding:34px 32px 26px;${FONT};font-size:16px;line-height:1.65;color:${INK}`;

const p = (html: string) => `<p style="margin:0 0 16px;${FONT};font-size:16px;line-height:1.65;color:${INK}">${html}</p>`;
const h1 = (text: string) => `<h1 style="margin:0 0 18px;${FONT};font-size:26px;line-height:1.2;font-weight:800;letter-spacing:-0.02em;color:${INK}">${text}</h1>`;
const small = (html: string) => `<p style="margin:0 0 16px;${FONT};font-size:13px;line-height:1.6;color:${MUTED}">${html}</p>`;

const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:${ORANGE};color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:999px;${FONT};font-size:15px;font-weight:600;margin:6px 0 10px">${label}</a>`;

/** A row of a details table, for the notifications the team receives. */
const row = (label: string, value: string) =>
  `<tr><td style="padding:8px 14px 8px 0;${FONT};font-size:13px;color:${MUTED};vertical-align:top;white-space:nowrap">${label}</td><td style="padding:8px 0;${FONT};font-size:15px;color:${INK}">${value}</td></tr>`;

const footerLink = (href: string, label: string) =>
  `<a href="${href}" style="color:${MUTED};text-decoration:underline;${FONT};font-size:13px">${label}</a>`;

const shell = (body: string, opts: { image?: string; imageAlt?: string; note?: string } = {}) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F5F8;margin:0;padding:0">
  <tr><td align="center" style="padding:28px 12px">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E4E8EC">
      <!-- header: the site's wordmark on its dark band -->
      <tr><td style="background:#0C0E12;padding:22px 32px">
        <a href="{{site_url}}" style="text-decoration:none">
          <span style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;border-radius:6px;background:${ORANGE};color:#ffffff;${FONT};font-size:18px;font-weight:800;vertical-align:middle">N</span>
          <span style="${FONT};font-size:21px;font-weight:800;letter-spacing:-0.02em;color:#ffffff;vertical-align:middle;padding-left:8px">${BRAND}</span>
        </a>
      </td></tr>
      <tr><td style="height:4px;line-height:4px;font-size:0;background:${ORANGE};background:linear-gradient(90deg,#E5352F,#F1531E,#F5A623,#27B36B,#2F97DB,#7E5BE6)">&nbsp;</td></tr>
${opts.image ? `      <tr><td style="background:#0C0E12"><img src="{{site_url}}${opts.image}" width="600" alt="${opts.imageAlt ?? ""}" style="display:block;width:100%;max-width:600px;height:auto;border:0" /></td></tr>
` : ""}      <tr><td style="${BODY_TD}">
        ${BODY_START}${body}${BODY_END}
      </td></tr>
      <!-- footer: follow us, the main pages, and why this arrived -->
      <tr><td style="background:#F6FAFD;border-top:1px solid #E4E8EC;padding:26px 32px">
        <p style="margin:0 0 8px;${FONT};font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${INK}">Follow us</p>
        <p style="margin:0 0 18px">${SOCIAL_LINKS.map((l) => footerLink(l.href, l.label)).join(` <span style="color:#C4CBD5">&nbsp;·&nbsp;</span> `)}</p>
        <p style="margin:0 0 18px">${[["/practices", "Practices"], ["/solutions", "Solutions"], ["/industries", "Industries"], ["/careers", "Careers"], ["/contact", "Contact"]].map(([h, l]) => footerLink(`{{site_url}}${h}`, l)).join(` <span style="color:#C4CBD5">&nbsp;·&nbsp;</span> `)}</p>
        <p style="margin:0 0 6px;${FONT};font-size:12px;line-height:1.6;color:${MUTED}">${opts.note ?? `You are receiving this email because you contacted ${BRAND} Technologies through our website.`}</p>
        <p style="margin:0;${FONT};font-size:12px;line-height:1.6;color:${MUTED}">© {{year}} ${BRAND} Technologies · ${footerLink("{{site_url}}/privacy", "Privacy Policy")} · ${footerLink("{{site_url}}/terms", "Terms")}</p>
      </td></tr>
    </table>
  </td></tr>
</table>`;

const TEAM_NOTE = `Sent by the ${BRAND} website to the people listed for this form in Admin → Email → Form notifications.`;

export const DEFAULT_TEMPLATES: Record<TemplateSlug, TemplateDef> = {
  /* ---- to the person who filled in a form ---- */
  "contact-ack": {
    slug: "contact-ack",
    name: "Enquiry received (to the sender)",
    subject: `We have your message, {{name}}`,
    vars: {
      name: "the sender's first name",
      site_url: "the website address",
    },
    html: shell(
      `${h1("Thank you for reaching out.")}
        ${p("Hi {{name}},")}
        ${p(`Your message has reached the ${BRAND} team. One of our consultants will read it and reply to you directly, usually within one business day.`)}
        ${p("If it is urgent, or you would like to add anything, simply reply to this email.")}
        <p style="margin:0 0 16px">${button("{{site_url}}/practices", "See what we do")}</p>
        ${small(`— The ${BRAND} team`)}`,
      { image: "/insights/platform.jpg", imageAlt: "Enterprise platforms" }
    ),
  },
  "application-ack": {
    slug: "application-ack",
    name: "Job application received (to the candidate)",
    subject: `Your application for {{job_title}}`,
    vars: {
      name: "the candidate's first name",
      job_title: "the role they applied for",
      site_url: "the website address",
    },
    html: shell(
      `${h1("We have your application.")}
        ${p("Hi {{name}},")}
        ${p(`Thank you for applying for <strong>{{job_title}}</strong> at ${BRAND}. Your application and CV have been received and are with our talent team.`)}
        ${p("We review every application ourselves. If your experience matches what the role needs, a recruiter will contact you to arrange a first conversation.")}
        ${p("In the meantime you can see the other roles we have open.")}
        <p style="margin:0 0 16px">${button("{{site_url}}/careers", "View open roles")}</p>
        ${small(`— ${BRAND} Talent team`)}`,
      { image: "/company/people-centered.jpg", imageAlt: "The team at work" }
    ),
  },
  "resume-ack": {
    slug: "resume-ack",
    name: "Resume received, no specific role (to the candidate)",
    subject: `We have your resume, {{name}}`,
    vars: {
      name: "the candidate's first name",
      site_url: "the website address",
    },
    html: shell(
      `${h1("Your resume is with us.")}
        ${p("Hi {{name}},")}
        ${p(`Thank you for sharing your resume with ${BRAND}. You did not apply for a particular role, so we have added it to our talent network.`)}
        ${p("Our recruiters look there first when a new role opens. If something fits your skills and experience, we will get in touch with you.")}
        ${p("New roles are posted on our careers page as they open.")}
        <p style="margin:0 0 16px">${button("{{site_url}}/careers", "View open roles")}</p>
        ${small(`— ${BRAND} Talent team`)}`,
      { image: "/company/technology-talent.jpg", imageAlt: "Technology talent" }
    ),
  },

  /* ---- to the team ---- */
  "lead-notify": {
    slug: "lead-notify",
    name: "New enquiry (to the team)",
    subject: `New enquiry from {{name}}`,
    vars: {
      name: "sender's name", email: "sender's email", company: "their company", phone: "their phone",
      practice: "the area they chose", message: "what they wrote", admin_url: "link to Enquiries in the admin",
    },
    html: shell(
      `${h1("New enquiry from the website")}
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px">
          ${row("Name", "{{name}}")}
          ${row("Email", `<a href="mailto:{{email}}" style="color:${ORANGE}">{{email}}</a>`)}
          ${row("Company", "{{company}}")}
          ${row("Phone", "{{phone}}")}
          ${row("Interest", "{{practice}}")}
        </table>
        <div style="margin:0 0 20px;padding:16px 18px;background:#F6FAFD;border-left:3px solid ${ORANGE};border-radius:6px;${FONT};font-size:15px;line-height:1.65;color:${INK}">{{message}}</div>
        ${p("Reply to this email to answer them directly.")}
        <p style="margin:0 0 6px">${button("{{admin_url}}", "Open in Enquiries")}</p>`,
      { note: TEAM_NOTE }
    ),
  },
  "application-notify": {
    slug: "application-notify",
    name: "New application or resume (to the team)",
    subject: `New application: {{name}} for {{job_title}}`,
    vars: {
      name: "candidate's name", email: "candidate's email", phone: "their phone", location: "their location",
      linkedin: "their LinkedIn address", job_title: "the role, or “General application” for a dropped resume",
      note: "their cover note", admin_url: "link to Job applications in the admin",
    },
    html: shell(
      `${h1("New application from the website")}
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px">
          ${row("Role", "<strong>{{job_title}}</strong>")}
          ${row("Name", "{{name}}")}
          ${row("Email", `<a href="mailto:{{email}}" style="color:${ORANGE}">{{email}}</a>`)}
          ${row("Phone", "{{phone}}")}
          ${row("Location", "{{location}}")}
          ${row("LinkedIn", "{{linkedin}}")}
        </table>
        <div style="margin:0 0 20px;padding:16px 18px;background:#F6FAFD;border-left:3px solid ${ORANGE};border-radius:6px;${FONT};font-size:15px;line-height:1.65;color:${INK}">{{note}}</div>
        ${p("The CV is in the admin. Reply to this email to write to the candidate.")}
        <p style="margin:0 0 6px">${button("{{admin_url}}", "Open in Job applications")}</p>`,
      { note: TEAM_NOTE }
    ),
  },

  /* ---- admin accounts ---- */
  "admin-invite": {
    slug: "admin-invite",
    name: "New admin — set your password",
    subject: `You've been added to the ${BRAND} admin`,
    vars: {
      name: "recipient's name",
      role: "their role (owner / admin / editor)",
      action_url: "one-time link to set a password",
      expiry: "how long the link is valid",
    },
    html: shell(
      `${p("Hi {{name}},")}
        ${p(`You've been given <strong>{{role}}</strong> access to the ${BRAND} admin. Set a password to sign in:`)}
        <p style="margin:0 0 16px">${button("{{action_url}}", "Set my password")}</p>
        ${small("This link expires in {{expiry}}. If you weren't expecting this, you can ignore this email.")}`,
      { note: `You are receiving this because an administrator added you to the ${BRAND} admin.` }
    ),
  },
  "password-reset": {
    slug: "password-reset",
    name: "Password reset",
    subject: `Reset your ${BRAND} admin password`,
    vars: {
      name: "recipient's name",
      action_url: "one-time reset link",
      expiry: "how long the link is valid",
    },
    html: shell(
      `${p("Hi {{name}},")}
        ${p("We received a request to reset your admin password. Click below to choose a new one:")}
        <p style="margin:0 0 16px">${button("{{action_url}}", "Reset password")}</p>
        ${small("This link expires in {{expiry}}. If you didn't ask for this, nothing has changed — you can ignore this email.")}`,
      { note: `You are receiving this because a password reset was requested for your ${BRAND} admin account.` }
    ),
  },
  newsletter: {
    slug: "newsletter",
    name: "Newsletter",
    subject: `News from ${BRAND}`,
    vars: {
      content: "the newsletter body (your draft is inserted here)",
      unsubscribe_url: "unsubscribe link",
    },
    html: shell(`{{content}}`, {
      note: `You are receiving this because you subscribed to updates from ${BRAND}. <a href="{{unsubscribe_url}}" style="color:${MUTED}">Unsubscribe</a>`,
    }),
  },
};

/**
 * The address links and images in an email are built on. A mail client cannot
 * reach a machine on your desk, so a localhost site URL falls back to the
 * public domain; otherwise every picture in a mail sent from development would
 * arrive broken.
 */
export function mailBaseUrl(): string {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:|$)/i.test(configured);
  return !configured || isLocal ? "https://www.testsoft.com" : configured;
}

/** For values typed into a public form, before they go into an HTML template. */
export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** {{site_url}} and {{year}} are always available; the rest come from the caller. */
export function renderTemplate(html: string, vars: Record<string, string>): string {
  const all: Record<string, string> = { site_url: mailBaseUrl(), year: String(new Date().getFullYear()), ...vars };
  return html.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_m, k) => all[k] ?? "");
}

/* The built-in templates are written to the database the first time anything
   asks for one, so they are rows the admin can edit like any other and the
   table is the single place a template lives. Existing rows are left alone:
   an edit is never overwritten by a deploy. Once per process. */
let seeded: Promise<void> | null = null;
function ensureSeeded(): Promise<void> {
  if (!seeded) {
    seeded = (async () => {
      for (const def of Object.values(DEFAULT_TEMPLATES)) {
        await q(
          "INSERT INTO email_templates (slug, name, subject, html) VALUES ($1,$2,$3,$4) ON CONFLICT (slug) DO NOTHING",
          [def.slug, def.name, def.subject, def.html]
        );
      }
      /* Rows written before the message was marked off from its frame: add the
         markers in place, which keeps whatever has been edited since. */
      await q(
        `UPDATE email_templates
            SET html = replace(replace(html, $1, $2), $3, $4)
          WHERE html LIKE '%' || $1 || '%' AND html NOT LIKE '%' || $5 || '%'`,
        [
          `<td style="padding:34px 32px 26px">\n        `,
          `<td style="${BODY_TD}">\n        ${BODY_START}`,
          `\n      </td></tr>\n      <!-- footer`,
          `${BODY_END}\n      </td></tr>\n      <!-- footer`,
          BODY_START,
        ]
      );
      /* The newsletter frame from before the shared header and footer. It holds
         no wording of its own, only {{content}}, so replacing it loses nothing. */
      await q(
        "UPDATE email_templates SET html = $1 WHERE slug = 'newsletter' AND html LIKE '%background:#E4641E;padding:22px 28px%'",
        [DEFAULT_TEMPLATES.newsletter.html]
      );
    })().catch(() => { seeded = null; });
  }
  return seeded;
}

/** Returns the stored template for a slug, or the built-in default. */
export async function getTemplate(slug: TemplateSlug): Promise<{ subject: string; html: string }> {
  await ensureSeeded();
  const row = await one<{ subject: string; html: string }>(
    "SELECT subject, html FROM email_templates WHERE slug = $1",
    [slug]
  );
  const def = DEFAULT_TEMPLATES[slug];
  return {
    subject: row?.subject || def.subject,
    html: row?.html || def.html,
  };
}

/* Templates the admin creates are stored under this prefix. They are starting
   points for the composer, not system mail, so they have no placeholders. */
export const CUSTOM_PREFIX = "custom-";
export const isCustomSlug = (slug: string) => slug.startsWith(CUSTOM_PREFIX);

/** All templates for the admin editor: the built-in ones (stored value falls
    back to default), then the ones the admin has created. */
export async function listTemplates() {
  await ensureSeeded();
  const rows = await q<{ slug: string; name: string; subject: string; html: string; updated_at: string }>(
    "SELECT slug, name, subject, html, updated_at FROM email_templates ORDER BY updated_at DESC"
  );
  const stored = new Map(rows.map((r) => [r.slug, r]));
  const builtIn = (Object.keys(DEFAULT_TEMPLATES) as TemplateSlug[]).map((slug) => {
    const def = DEFAULT_TEMPLATES[slug];
    const s = stored.get(slug);
    return {
      slug: slug as string,
      name: def.name,
      vars: def.vars as Record<string, string>,
      subject: s?.subject || def.subject,
      html: s?.html || def.html,
      /* Every built-in now has a row, so "customised" is whether it still
         matches what shipped. */
      customised: !!s && (s.html !== def.html || s.subject !== def.subject),
      custom: false,
      updated_at: s?.updated_at ?? null,
    };
  });
  const custom = rows.filter((r) => isCustomSlug(r.slug)).map((r) => ({
    slug: r.slug,
    name: r.name,
    vars: {} as Record<string, string>,
    subject: r.subject,
    html: r.html,
    customised: false,
    custom: true,
    updated_at: r.updated_at as string | null,
  }));
  return [...builtIn, ...custom];
}
