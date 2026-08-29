import { q } from "@/lib/db";
import { bad, notFound } from "@/lib/http";
import { DEFAULT_TEMPLATES, listTemplates, type TemplateSlug } from "@/lib/email-templates";

export async function list() {
  return { templates: await listTemplates() };
}

export async function save(slug: string, input: Record<string, unknown>) {
  if (!(slug in DEFAULT_TEMPLATES)) throw notFound("Unknown template.");
  const subject = String(input.subject ?? "").trim();
  const html = String(input.html ?? "");
  if (!subject) throw bad("Subject is required.");
  if (html.length < 20) throw bad("The template body looks empty.");
  await q(
    `INSERT INTO email_templates (slug, name, subject, html)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (slug) DO UPDATE SET subject = EXCLUDED.subject, html = EXCLUDED.html, updated_at = now()`,
    [slug, DEFAULT_TEMPLATES[slug as TemplateSlug].name, subject, html]
  );
  return { ok: true };
}

export async function reset(slug: string) {
  if (!(slug in DEFAULT_TEMPLATES)) throw notFound("Unknown template.");
  await q("DELETE FROM email_templates WHERE slug = $1", [slug]);
  return { ok: true };
}
