import { NextResponse } from "next/server";
import { q } from "@/lib/db";

type ActiveBanner = {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_url: string;
  media_id: string | null;
  sort_order: number;
  background_fx: string;
  media_mime_type: string | null;
  media_alt: string | null;
};

export async function GET() {
  const banners = await q<ActiveBanner>(`
    SELECT
      b.id, b.title, b.subtitle, b.cta_text, b.cta_url, b.media_id, b.sort_order, b.background_fx,
      i.mime_type as media_mime_type, i.alt as media_alt
    FROM banners b
    LEFT JOIN site_images i ON b.media_id = i.id
    WHERE b.is_active = true
    ORDER BY b.sort_order ASC, b.created_at DESC
  `);

  return NextResponse.json({ banners });
}
