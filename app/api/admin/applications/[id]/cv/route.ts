import { one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("applications");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;

  const row = await one<{ cv_data: Buffer | Uint8Array; cv_mime_type: string; cv_filename: string }>(
    "SELECT cv_data, cv_mime_type, cv_filename FROM applications WHERE id = $1",
    [id]
  );
  if (!row) return new Response("Not found", { status: 404 });

  const buf = Buffer.isBuffer(row.cv_data) ? row.cv_data : Buffer.from(row.cv_data as Uint8Array);
  const safeName = (row.cv_filename || "cv").replace(/[^\w.\-]+/g, "_");

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": row.cv_mime_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
