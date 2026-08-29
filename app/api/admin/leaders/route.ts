import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { cuid } from "@/lib/id";

type Leader = {
  id: string; name: string; title: string; bio: string; linkedin_url: string;
  photo_id: string | null; photo_url: string; sort_order: number; is_active: boolean;
};

function read(body: Record<string, unknown>) {
  return {
    name: String(body.name ?? "").trim(),
    title: String(body.title ?? "").trim(),
    bio: String(body.bio ?? "").trim(),
    linkedin_url: String(body.linkedin_url ?? "").trim(),
    photo_id: body.photo_id ? String(body.photo_id) : null,
    photo_url: String(body.photo_url ?? "").trim(),
    is_active: typeof body.is_active === "boolean" ? body.is_active : true,
    sort_order: Number.isFinite(Number(body.sort_order)) ? parseInt(String(body.sort_order), 10) || 0 : 0,
  };
}

export async function GET() {
  const guard = await requireAdmin("leadership");
  if (guard instanceof Response) return guard;
  const leaders = await q<Leader>("SELECT * FROM leaders ORDER BY sort_order ASC, created_at ASC");
  return NextResponse.json({ leaders });
}

export async function POST(req: Request) {
  const guard = await requireAdmin("leadership");
  if (guard instanceof Response) return guard;
  const v = read(await req.json().catch(() => ({})));
  if (!v.name) return NextResponse.json({ error: "Name is required." }, { status: 422 });

  const id = cuid();
  await q(
    `INSERT INTO leaders (id, name, title, bio, linkedin_url, photo_id, photo_url, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [id, v.name, v.title, v.bio, v.linkedin_url, v.photo_id, v.photo_url, v.sort_order, v.is_active]
  );
  const leader = await one<Leader>("SELECT * FROM leaders WHERE id = $1", [id]);
  return NextResponse.json({ leader });
}
