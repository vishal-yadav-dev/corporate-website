import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { cuid } from "@/lib/id";

const MAX_BYTES = 20 * 1024 * 1024;
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/ogg"
];
type Img = { id: string; slot: string | null; alt: string; mime_type: string; size: number; created_at: string };

export async function GET(req: Request) {
  const guard = await requireAdmin("images");
  if (guard instanceof Response) return guard;
  const url = new URL(req.url);
  const slot = url.searchParams.get("slot");
  const images = slot
    ? await q<Img>("SELECT id, slot, alt, mime_type, size, created_at FROM site_images WHERE slot = $1 ORDER BY created_at DESC", [slot])
    : await q<Img>("SELECT id, slot, alt, mime_type, size, created_at FROM site_images ORDER BY created_at DESC");
  return NextResponse.json({ images });
}

export async function POST(req: Request) {
  const guard = await requireAdmin("images");
  if (guard instanceof Response) return guard;
  const form = await req.formData();
  const file = form.get("file");
  const slot = form.get("slot") ? String(form.get("slot")) : null;
  const alt = form.get("alt") ? String(form.get("alt")) : "";
  if (!(file instanceof File)) return NextResponse.json({ error: "No file uploaded." }, { status: 422 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Unsupported file type. Use common images or MP4/WebM/Ogg videos." }, { status: 422 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File exceeds 20MB." }, { status: 422 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const id = cuid();
  await q("INSERT INTO site_images (id, slot, alt, mime_type, data, size) VALUES ($1,$2,$3,$4,$5,$6)",
    [id, slot, alt, file.type, bytes, file.size]);
  return NextResponse.json({ image: { id, slot, alt, mime_type: file.type, size: file.size } });
}
