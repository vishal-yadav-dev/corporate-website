import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { q, one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { COLLECTIONS, type Field } from "@/lib/site";

function coerce(f: Field, v: unknown) {
  if (f.type === "bool") return typeof v === "boolean" ? v : Boolean(f.default);
  if (f.type === "int") return Number.isFinite(Number(v)) ? parseInt(String(v), 10) || 0 : Number(f.default ?? 0);
  if (v === null || v === undefined || v === "") return f.name.endsWith("_id") ? null : (f.default ?? "");
  return String(v).trim();
}

export async function PUT(req: Request, ctx: { params: Promise<{ type: string; id: string }> }) {
  const guard = await requireAdmin("site");
  if (guard instanceof Response) return guard;
  const { type, id } = await ctx.params;
  const c = COLLECTIONS[type];
  if (!c) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });

  const existing = await one(`SELECT id FROM ${c.table} WHERE id = $1`, [id]);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const sets: string[] = [];
  const vals: unknown[] = [];
  for (const f of c.fields) {
    const val = coerce(f, body[f.name]);
    if (f.required && !val) return NextResponse.json({ error: `${f.name} is required.` }, { status: 422 });
    vals.push(val);
    sets.push(`${f.name} = $${vals.length}`);
  }
  if (c.stamped) {
    vals.push(guard.name || guard.email);
    sets.push(`updated_by = $${vals.length}`);
  }
  vals.push(id);
  await q(`UPDATE ${c.table} SET ${sets.join(", ")}, updated_at = now() WHERE id = $${vals.length}`, vals);
  /* Every site page is ISR'd for a minute. Without this a saved change would not
     show for up to 60s, which reads as a failure. */
  revalidatePath("/", "layout");
  const item = await one(`SELECT * FROM ${c.table} WHERE id = $1`, [id]);
  return NextResponse.json({ item });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ type: string; id: string }> }) {
  const guard = await requireAdmin("site");
  if (guard instanceof Response) return guard;
  const { type, id } = await ctx.params;
  const c = COLLECTIONS[type];
  if (!c) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  await q(`DELETE FROM ${c.table} WHERE id = $1`, [id]);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
