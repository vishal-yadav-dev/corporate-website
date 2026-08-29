import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { slugify, type Job } from "@/lib/jobs";

const FIELDS = [
  "title", "practice", "location", "employment_type", "workplace", "experience",
  "salary_range", "summary", "description", "responsibilities", "requirements",
  "benefits", "status",
] as const;

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("jobs");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;

  const existing = await one<Job>("SELECT * FROM jobs WHERE id = $1", [id]);
  if (!existing) return NextResponse.json({ error: "Job not found." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const v: Record<string, unknown> = {};
  for (const f of FIELDS) v[f] = body[f] == null ? "" : String(body[f]).trim();
  v.employment_type = v.employment_type || "Full-time";
  v.workplace = v.workplace || "On-site";
  v.status = v.status || "draft";
  if (!v.title) return NextResponse.json({ error: "Title is required." }, { status: 422 });
  const post_linkedin = Boolean(body.post_linkedin);
  const post_naukri = Boolean(body.post_naukri);
  const sort_order = Number.isFinite(Number(body.sort_order)) ? parseInt(String(body.sort_order), 10) || 0 : 0;

  // Keep slug stable unless the title changed
  let slug = existing.slug;
  if (String(v.title) !== existing.title) {
    const base = slugify(String(v.title));
    slug = base;
    for (let i = 2; await one("SELECT id FROM jobs WHERE slug = $1 AND id <> $2", [slug, id]); i++) {
      slug = `${base}-${i}`;
    }
  }

  await q(
    `UPDATE jobs SET
      title=$1, slug=$2, practice=$3, location=$4, employment_type=$5, workplace=$6, experience=$7,
      salary_range=$8, summary=$9, description=$10, responsibilities=$11, requirements=$12,
      benefits=$13, status=$14, post_linkedin=$15, post_naukri=$16, sort_order=$17, updated_at=now()
     WHERE id=$18`,
    [
      v.title, slug, v.practice, v.location, v.employment_type, v.workplace, v.experience,
      v.salary_range, v.summary, v.description, v.responsibilities, v.requirements, v.benefits,
      v.status, post_linkedin, post_naukri, sort_order, id,
    ]
  );

  const job = await one<Job>("SELECT * FROM jobs WHERE id = $1", [id]);
  return NextResponse.json({ job });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("jobs");
  if (guard instanceof Response) return guard;
  const { id } = await ctx.params;
  await q("DELETE FROM jobs WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
