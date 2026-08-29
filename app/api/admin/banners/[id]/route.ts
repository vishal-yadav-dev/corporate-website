import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

type BannerRow = {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_url: string;
  media_id: string | null;
  sort_order: number;
  background_fx: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  media_mime_type: string | null;
  media_alt: string | null;
};

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("banners");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  const subtitle = String(body.subtitle ?? "").trim();
  const cta_text = String(body.cta_text ?? "").trim();
  const cta_url = String(body.cta_url ?? "").trim();
  const media_id = body.media_id ? String(body.media_id) : null;
  const sort_order = Number.isInteger(body.sort_order) ? Number(body.sort_order) : 0;
  const is_active = typeof body.is_active === "boolean" ? body.is_active : true;
  const background_fx = String(body.background_fx ?? "").trim();

  await q(
    `UPDATE banners 
     SET title = $1, subtitle = $2, cta_text = $3, cta_url = $4, media_id = $5, sort_order = $6, is_active = $7, background_fx = $8, updated_at = now()
     WHERE id = $9`,
    [title, subtitle, cta_text, cta_url, media_id, sort_order, is_active, background_fx, id]
  );

  const banner = await one<BannerRow>(`
    SELECT 
      b.id, b.title, b.subtitle, b.cta_text, b.cta_url, b.media_id, b.sort_order, b.background_fx, b.is_active, b.created_at, b.updated_at,
      i.mime_type as media_mime_type, i.alt as media_alt
    FROM banners b
    LEFT JOIN site_images i ON b.media_id = i.id
    WHERE b.id = $1
  `, [id]);

  if (!banner) {
    return NextResponse.json({ error: "Banner not found" }, { status: 404 });
  }

  return NextResponse.json({ banner });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("banners");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;

  await q("DELETE FROM banners WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
