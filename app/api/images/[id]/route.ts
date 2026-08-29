import { q } from "@/lib/db";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const rows = await q<{ data: Buffer | Uint8Array; mime_type: string }>(
    "SELECT data, mime_type FROM site_images WHERE id = $1", [id]
  );
  const img = rows[0];
  if (!img) return new Response("Not found", { status: 404 });
  const buf = Buffer.isBuffer(img.data) ? img.data : Buffer.from(img.data as Uint8Array);
  return new Response(new Uint8Array(buf), {
    headers: { "Content-Type": img.mime_type, "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}
