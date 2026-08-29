import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

export async function GET() {
  const guard = await requireAdmin("content");
  if (guard instanceof Response) return guard;
  const content = await q<{ key: string; value: string; updated_at: string }>("SELECT * FROM content ORDER BY key ASC");
  return NextResponse.json({ content });
}

export async function PUT(req: Request) {
  const guard = await requireAdmin("content");
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
  return NextResponse.json({ ok: true });
}
