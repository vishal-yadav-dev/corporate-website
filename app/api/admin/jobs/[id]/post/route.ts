import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { jobPostText, jobPublicUrl, linkedinShareUrl, type Job } from "@/lib/jobs";

/**
 * POST /api/admin/jobs/[id]/post
 * body: { channel: "linkedin" | "naukri", mark?: boolean }
 * Returns the share URL + ready-to-paste post text. When `mark` is true, also
 * stamps the channel as posted (there is no official Naukri / LinkedIn posting
 * API, so distribution is assisted, not automated).
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("jobs");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const channel = body.channel === "naukri" ? "naukri" : "linkedin";
  const mark = Boolean(body.mark);

  const job = await one<Job>("SELECT * FROM jobs WHERE id = $1", [id]);
  if (!job) return NextResponse.json({ error: "Job not found." }, { status: 404 });

  if (mark) {
    const col = channel === "naukri" ? "naukri_posted_at" : "linkedin_posted_at";
    await q(`UPDATE jobs SET ${col} = now(), updated_at = now() WHERE id = $1`, [id]);
  }

  const url = jobPublicUrl(job.slug);
  const updated = await one<Job>("SELECT * FROM jobs WHERE id = $1", [id]);

  return NextResponse.json({
    channel,
    url,
    shareUrl: channel === "linkedin" ? linkedinShareUrl(url) : "https://www.naukri.com/recruit/post-jobs",
    postText: jobPostText(job),
    job: updated,
  });
}
