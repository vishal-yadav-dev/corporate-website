import { q, one } from "@/lib/db";

/**
 * Editable transactional email templates. Defaults live here; admins can override
 * subject + HTML from /admin/email-templates. Placeholders use {{name}} syntax.
 */

export type TemplateSlug = "admin-invite" | "password-reset" | "newsletter";

export type TemplateDef = {
  slug: TemplateSlug;
  name: string;
  subject: string;
  html: string;
  /** placeholder -> human hint, shown in the editor */
  vars: Record<string, string>;
};

const shell = (body: string) => `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#17222E">
  <div style="background:#E4641E;padding:22px 28px;border-radius:12px 12px 0 0">
    <span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:-0.02em">Testsoft</span>
  </div>
  <div style="border:1px solid #E7EAEE;border-top:none;border-radius:0 0 12px 12px;padding:28px">
    ${body}
    <p style="margin:22px 0 0;color:#5A6572;font-size:13px">— Testsoft Technologies</p>
  </div>
</div>`;

const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#E4641E;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;margin:8px 0">${label}</a>`;

export const DEFAULT_TEMPLATES: Record<TemplateSlug, TemplateDef> = {
  "admin-invite": {
    slug: "admin-invite",
    name: "New admin — set your password",
    subject: "You've been added to the Testsoft admin",
    vars: {
      name: "recipient's name",
      role: "their role (owner / admin / editor)",
      action_url: "one-time link to set a password",
      expiry: "how long the link is valid",
    },
    html: shell(
      `<p style="margin:0 0 14px">Hi {{name}},</p>
       <p style="margin:0 0 14px">You've been given <strong>{{role}}</strong> access to the Testsoft admin. Set a password to sign in:</p>
       <p style="margin:0 0 14px">${button("{{action_url}}", "Set my password")}</p>
       <p style="margin:0 0 14px;color:#5A6572;font-size:13px">This link expires in {{expiry}}. If you weren't expecting this, you can ignore this email.</p>`
    ),
  },
  "password-reset": {
    slug: "password-reset",
    name: "Password reset",
    subject: "Reset your Testsoft admin password",
    vars: {
      name: "recipient's name",
      action_url: "one-time reset link",
      expiry: "how long the link is valid",
    },
    html: shell(
      `<p style="margin:0 0 14px">Hi {{name}},</p>
       <p style="margin:0 0 14px">We received a request to reset your admin password. Click below to choose a new one:</p>
       <p style="margin:0 0 14px">${button("{{action_url}}", "Reset password")}</p>
       <p style="margin:0 0 14px;color:#5A6572;font-size:13px">This link expires in {{expiry}}. If you didn't ask for this, nothing has changed — you can ignore this email.</p>`
    ),
  },
  newsletter: {
    slug: "newsletter",
    name: "Newsletter",
    subject: "News from Testsoft",
    vars: {
      content: "the newsletter body (your draft is inserted here)",
      unsubscribe_url: "unsubscribe link",
    },
    html: shell(
      `{{content}}
       <p style="margin:22px 0 0;color:#5A6572;font-size:12px"><a href="{{unsubscribe_url}}" style="color:#5A6572">Unsubscribe</a></p>`
    ),
  },
};

export function renderTemplate(html: string, vars: Record<string, string>): string {
  return html.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_m, k) => vars[k] ?? "");
}

/** Returns the stored template for a slug, or the built-in default. */
export async function getTemplate(slug: TemplateSlug): Promise<{ subject: string; html: string }> {
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

/** All templates for the admin editor (stored value falls back to default). */
export async function listTemplates() {
  const rows = await q<{ slug: string; subject: string; html: string; updated_at: string }>(
    "SELECT slug, subject, html, updated_at FROM email_templates"
  );
  const stored = new Map(rows.map((r) => [r.slug, r]));
  return (Object.keys(DEFAULT_TEMPLATES) as TemplateSlug[]).map((slug) => {
    const def = DEFAULT_TEMPLATES[slug];
    const s = stored.get(slug);
    return {
      slug,
      name: def.name,
      vars: def.vars,
      subject: s?.subject || def.subject,
      html: s?.html || def.html,
      customised: !!s,
      updated_at: s?.updated_at ?? null,
    };
  });
}
