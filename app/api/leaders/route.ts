import { NextResponse } from "next/server";
import { q } from "@/lib/db";

type Leader = {
  id: string;
  name: string;
  title: string;
  bio: string;
  linkedin_url: string;
  photo_id: string | null;
  photo_url: string;
  sort_order: number;
};

export async function GET() {
  const leaders = await q<Leader>(`
    SELECT id, name, title, bio, linkedin_url, photo_id, photo_url, sort_order
    FROM leaders
    WHERE is_active = true
    ORDER BY sort_order ASC, created_at ASC
  `);
  return NextResponse.json({ leaders });
}
