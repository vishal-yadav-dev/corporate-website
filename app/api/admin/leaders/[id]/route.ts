import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

type Leader = {
  id: string; name: string; title: string; bio: string; linkedin_url: string;
  photo_id: string | null; photo_url: string; sort_order: number; is_active: boolean;
};

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("leadership");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 422 });
  const title = String(body.title ?? "").trim();
  const bio = String(body.bio ?? "").trim();
  const linkedin_url = String(body.linkedin_url ?? "").trim();
  const photo_id = body.photo_id ? String(body.photo_id) : null;
  const photo_url = String(body.photo_url ?? "").trim();
  const is_active = typeof body.is_active === "boolean" ? body.is_active : true;
  const sort_order = Number.isFinite(Number(body.sort_order)) ? parseInt(String(body.sort_order), 10) || 0 : 0;

  await q(
    `UPDATE leaders SET name=$1, title=$2, bio=$3, linkedin_url=$4, photo_id=$5, photo_url=$6,
       sort_order=$7, is_active=$8, updated_at=now() WHERE id=$9`,
    [name, title, bio, linkedin_url, photo_id, photo_url, sort_order, is_active, id]
  );
  const leader = await one<Leader>("SELECT * FROM leaders WHERE id = $1", [id]);
  if (!leader) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ leader });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("leadership");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;
  await q("DELETE FROM leaders WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
