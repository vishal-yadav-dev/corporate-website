import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { LEGAL_DEFAULTS, legalDefault, legalKeys } from "@/lib/legal";

/* The policy pages. Stored in `content` under legal.<slug>.title / .body; a
   policy with no rows is still the bundled default from lib/legal.ts. */

export async function GET() {
  const guard = await requireAdmin("legal");
  if (guard instanceof Response) return guard;
  const rows = await q<{ key: string; value: string; updated_at: string }>(
    "SELECT key, value, updated_at FROM content WHERE key LIKE 'legal.%'"
  );
  const stored = new Map(rows.map((r) => [r.key, r]));
  const pages = LEGAL_DEFAULTS.map((d) => {
    const k = legalKeys(d.slug);
    const title = stored.get(k.title);
    const body = stored.get(k.body);
    return {
      slug: d.slug,
      title: title?.value || d.title,
      body: body?.value || d.body,
      edited: Boolean(title || body),
      updatedAt: body?.updated_at ?? title?.updated_at ?? null,
    };
  });
  return NextResponse.json({ pages });
}

export async function PUT(req: Request) {
  const guard = await requireAdmin("legal");
  if (guard instanceof Response) return guard;
  const body = await req.json().catch(() => ({}));
  const slug = String(body.slug ?? "");
  const title = String(body.title ?? "").trim();
  const text = String(body.body ?? "").trim();
  if (!legalDefault(slug)) return NextResponse.json({ error: "Unknown policy." }, { status: 404 });
  if (!title) return NextResponse.json({ error: "A title is required." }, { status: 422 });
  /* An empty policy would publish a blank legal page. */
  if (!text) return NextResponse.json({ error: "The policy text cannot be empty." }, { status: 422 });

  const k = legalKeys(slug);
  for (const [key, value] of [[k.title, title], [k.body, text]]) {
    await q(
      `INSERT INTO content (key, value) VALUES ($1,$2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [key, value]
    );
  }
  revalidatePath(`/${slug}`);
  return NextResponse.json({ ok: true });
}

/** Back to the bundled text. */
export async function DELETE(req: Request) {
  const guard = await requireAdmin("legal");
  if (guard instanceof Response) return guard;
  const body = await req.json().catch(() => ({}));
  const slug = String(body.slug ?? "");
  if (!legalDefault(slug)) return NextResponse.json({ error: "Unknown policy." }, { status: 404 });
  const k = legalKeys(slug);
  await q("DELETE FROM content WHERE key = $1 OR key = $2", [k.title, k.body]);
  revalidatePath(`/${slug}`);
  return NextResponse.json({ ok: true });
}
