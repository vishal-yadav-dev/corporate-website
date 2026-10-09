import { q, one } from "@/lib/db";
import { cuid } from "@/lib/id";
import { bad, notFound } from "@/lib/http";
import { DEFAULT_TEMPLATES, CUSTOM_PREFIX, isCustomSlug, listTemplates, type TemplateSlug } from "@/lib/email-templates";

export async function list() {
  return { templates: await listTemplates() };
}

function read(input: Record<string, unknown>) {
  const subject = String(input.subject ?? "").trim();
  const html = String(input.html ?? "");
  if (!subject) throw bad("Subject is required.");
  if (html.length < 20) throw bad("The template body looks empty.");
  return { subject, html };
}

/** A new template of the admin's own, offered as a starting point in the composer. */
export async function create(input: Record<string, unknown>) {
  const name = String(input.name ?? "").trim();
  if (!name) throw bad("Give the template a name.");
  const { subject, html } = read(input);
  const slug = `${CUSTOM_PREFIX}${cuid()}`;
  await q("INSERT INTO email_templates (slug, name, subject, html) VALUES ($1,$2,$3,$4)", [slug, name, subject, html]);
  return { ok: true, slug };
}

export async function save(slug: string, input: Record<string, unknown>) {
  const { subject, html } = read(input);
  if (isCustomSlug(slug)) {
    const row = await one<{ name: string }>("SELECT name FROM email_templates WHERE slug = $1", [slug]);
    if (!row) throw notFound("Unknown template.");
    const name = String(input.name ?? "").trim() || row.name;
    await q("UPDATE email_templates SET name = $2, subject = $3, html = $4, updated_at = now() WHERE slug = $1", [slug, name, subject, html]);
    return { ok: true };
  }
  if (!(slug in DEFAULT_TEMPLATES)) throw notFound("Unknown template.");
  await q(
    `INSERT INTO email_templates (slug, name, subject, html)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (slug) DO UPDATE SET subject = EXCLUDED.subject, html = EXCLUDED.html, updated_at = now()`,
    [slug, DEFAULT_TEMPLATES[slug as TemplateSlug].name, subject, html]
  );
  return { ok: true };
}

/** Built-in: back to the default. One of the admin's own: deleted. */
export async function reset(slug: string) {
  if (!isCustomSlug(slug) && !(slug in DEFAULT_TEMPLATES)) throw notFound("Unknown template.");
  await q("DELETE FROM email_templates WHERE slug = $1", [slug]);
  return { ok: true };
}
