import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { revalidatePath } from "next/cache";
import { canAccess } from "@/lib/permissions";

/* Three admin screens write here: Homepage text, Page text and the About tab of
   Site content. Any one of those grants is enough; requiring "content" alone
   locked an editor out of a screen they had been given. */
async function guardContent() {
  const session = await requireAdmin();
  if (session instanceof Response) return session;
  const who = { role: session.role, perms: session.perms };
  if (!["content", "pages", "site"].some((k) => canAccess(who, k))) {
    return NextResponse.json({ error: "You don't have access to this area." }, { status: 403 });
  }
  return session;
}

export async function GET() {
  const guard = await guardContent();
  if (guard instanceof Response) return guard;
  const content = await q<{ key: string; value: string; updated_at: string }>("SELECT * FROM content ORDER BY key ASC");
  return NextResponse.json({ content });
}

export async function PUT(req: Request) {
  const guard = await guardContent();
  if (guard instanceof Response) return guard;
  const body = await req.json().catch(() => ({}));
  const entries = body.entries as { key: string; value: string }[] | undefined;
  if (!Array.isArray(entries)) return NextResponse.json({ error: "Invalid payload." }, { status: 422 });
  for (const e of entries) {
    await q(
      `INSERT INTO content (key, value) VALUES ($1,$2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [e.key, String(e.value ?? "")]
    );
  }
  /* Every site page is ISR'd for a minute. Without this the editor would save
     successfully and the change would not show for up to 60s, which reads as a
     failure. */
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const guard = await guardContent();
  if (guard instanceof Response) return guard;
  const body = await req.json().catch(() => ({}));
  const keys = body.keys as string[] | undefined;
  if (!Array.isArray(keys) || !keys.length) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 422 });
  }
  /* Resetting removes the row. The registry default then applies again, so a
     default that changes in code is picked up instead of being shadowed by a
     stored copy of its old text. */
  for (const k of keys) await q("DELETE FROM content WHERE key = $1", [k]);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
