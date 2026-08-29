import { NextResponse } from "next/server";
import { one } from "@/lib/db";
import type { Job } from "@/lib/jobs";

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const job = await one<Job>(
    "SELECT * FROM jobs WHERE slug = $1 AND status = 'published'",
    [slug]
  );
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ job });
}
