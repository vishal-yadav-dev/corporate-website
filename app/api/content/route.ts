import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export async function GET() {
  const rows = await q<{ key: string; value: string }>("SELECT key, value FROM content");
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return NextResponse.json(map, { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" } });
}
