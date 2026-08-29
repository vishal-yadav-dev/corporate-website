import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { cuid } from "@/lib/id";
import { COLLECTIONS, type Field } from "@/lib/site";
import { slugify } from "@/lib/jobs";

function coerce(f: Field, v: unknown) {
  if (f.type === "bool") return typeof v === "boolean" ? v : Boolean(f.default);
  if (f.type === "int") return Number.isFinite(Number(v)) ? parseInt(String(v), 10) || 0 : Number(f.default ?? 0);
  if (v === null || v === undefined || v === "") return f.name.endsWith("_id") ? null : (f.default ?? "");
  return String(v).trim();
}

export async function GET(_req: Request, ctx: { params: Promise<{ type: string }> }) {
  const guard = await requireAdmin("site");
  if (guard instanceof Response) return guard;
  const { type } = await ctx.params;
  const c = COLLECTIONS[type];
  if (!c) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  const rows = await q(`SELECT * FROM ${c.table} ORDER BY ${c.order}`);
  return NextResponse.json({ items: rows });
}

export async function POST(req: Request, ctx: { params: Promise<{ type: string }> }) {
  const guard = await requireAdmin("site");
  if (guard instanceof Response) return guard;
  const { type } = await ctx.params;
  const c = COLLECTIONS[type];
  if (!c) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const cols: string[] = ["id"];
  const vals: unknown[] = [cuid()];
  for (const f of c.fields) {
    const val = coerce(f, body[f.name]);
    if (f.required && !val) return NextResponse.json({ error: `${f.name} is required.` }, { status: 422 });
    cols.push(f.name);
    vals.push(val);
  }

  if (c.slugFrom) {
    const base = slugify(String(body[c.slugFrom] ?? "item"));
    let slug = base;
    for (let i = 2; await one(`SELECT id FROM ${c.table} WHERE slug = $1`, [slug]); i++) slug = `${base}-${i}`;
    cols.push("slug");
    vals.push(slug);
  }

  const ph = vals.map((_, i) => `$${i + 1}`).join(",");
  await q(`INSERT INTO ${c.table} (${cols.join(",")}) VALUES (${ph})`, vals);
  const item = await one(`SELECT * FROM ${c.table} WHERE id = $1`, [vals[0]]);
  return NextResponse.json({ item });
}
