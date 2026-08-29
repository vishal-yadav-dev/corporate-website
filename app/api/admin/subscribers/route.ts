import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

type Sub = { id: string; email: string; status: string; created_at: string };

export async function GET(req: Request) {
  const guard = await requireAdmin("subscribers");
  if (guard instanceof Response) return guard;
  const subs = await q<Sub>("SELECT * FROM subscribers ORDER BY created_at DESC");
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "csv") {
    const rows = subs.map((s) => `"${s.email}","${s.status}","${s.created_at}"`);
    const csv = ["Email,Status,Subscribed", ...rows].join("\n");
    return new Response(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="subscribers-${Date.now()}.csv"` } });
  }
  return NextResponse.json({ subscribers: subs });
}
