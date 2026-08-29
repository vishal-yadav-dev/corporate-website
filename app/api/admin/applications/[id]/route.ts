import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { APPLICATION_STATUSES } from "@/lib/jobs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("applications");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const status = String(body.status ?? "");
  if (!(APPLICATION_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 422 });
  }
  await q("UPDATE applications SET status = $1 WHERE id = $2", [status, id]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("applications");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;
  await q("DELETE FROM applications WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
