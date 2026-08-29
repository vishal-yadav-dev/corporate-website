import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("employees");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;
  const b = await req.json().catch(() => ({}));
  const fields: string[] = [];
  const params: unknown[] = [];
  const set = (col: string, val: unknown) => { params.push(val); fields.push(`${col} = $${params.length}`); };
  if ("name" in b) set("name", String(b.name).trim());
  if ("title" in b) set("title", b.title ? String(b.title).trim() : null);
  if ("department" in b) set("department", b.department ? String(b.department).trim() : null);
  if ("location" in b) set("location", b.location ? String(b.location).trim() : null);
  if ("startDate" in b) set("start_date", b.startDate || null);
  if ("status" in b && ["active","inactive"].includes(String(b.status))) set("status", String(b.status));
  if (!fields.length) return NextResponse.json({ error: "Nothing to update." }, { status: 422 });
  params.push(id);
  await q(`UPDATE employees SET ${fields.join(", ")} WHERE id = $${params.length}`, params);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("employees");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;
  await q("DELETE FROM employees WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
