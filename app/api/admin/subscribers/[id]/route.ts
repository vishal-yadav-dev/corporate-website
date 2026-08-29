import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("subscribers");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;
  await q("DELETE FROM subscribers WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
