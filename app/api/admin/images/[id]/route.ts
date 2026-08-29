import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("images");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  if ("slot" in body) await q("UPDATE site_images SET slot = $1 WHERE id = $2", [body.slot || null, id]);
  if ("alt" in body) await q("UPDATE site_images SET alt = $1 WHERE id = $2", [String(body.alt), id]);
  return NextResponse.json({ ok: true });
}
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("images");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;
  await q("DELETE FROM site_images WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
