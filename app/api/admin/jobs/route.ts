import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { cuid } from "@/lib/id";
import { slugify, type Job } from "@/lib/jobs";

const FIELDS = [
  "title", "practice", "location", "employment_type", "workplace", "experience",
  "salary_range", "summary", "description", "responsibilities", "requirements",
  "benefits", "status",
] as const;

function readBody(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of FIELDS) out[f] = body[f] == null ? "" : String(body[f]).trim();
  out.employment_type = out.employment_type || "Full-time";
  out.workplace = out.workplace || "On-site";
  out.status = out.status || "draft";
  out.post_linkedin = Boolean(body.post_linkedin);
  out.post_naukri = Boolean(body.post_naukri);
  out.sort_order = Number.isFinite(Number(body.sort_order)) ? parseInt(String(body.sort_order), 10) || 0 : 0;
  return out;
}

export async function GET() {
  const guard = await requireAdmin("jobs");
  if (guard instanceof Response) return guard;

  const jobs = await q<Job & { application_count: number }>(`
    SELECT j.*, COUNT(a.id)::int AS application_count
    FROM jobs j
    LEFT JOIN applications a ON a.job_id = j.id
    GROUP BY j.id
    ORDER BY j.sort_order ASC, j.created_at DESC
  `);
  return NextResponse.json({ jobs });
}

export async function POST(req: Request) {
  const guard = await requireAdmin("jobs");
  if (guard instanceof Response) return guard;

  const body = await req.json().catch(() => ({}));
  const v = readBody(body);
  if (!v.title) return NextResponse.json({ error: "Title is required." }, { status: 422 });

  // Unique slug
  const base = slugify(String(v.title));
  let slug = base;
  for (let i = 2; await one("SELECT id FROM jobs WHERE slug = $1", [slug]); i++) slug = `${base}-${i}`;

  const id = cuid();
  await q(
    `INSERT INTO jobs
      (id, title, slug, practice, location, employment_type, workplace, experience, salary_range,
       summary, description, responsibilities, requirements, benefits, status,
       post_linkedin, post_naukri, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
    [
      id, v.title, slug, v.practice, v.location, v.employment_type, v.workplace, v.experience,
      v.salary_range, v.summary, v.description, v.responsibilities, v.requirements, v.benefits,
      v.status, v.post_linkedin, v.post_naukri, v.sort_order,
    ]
  );

  const job = await one<Job>("SELECT * FROM jobs WHERE id = $1", [id]);
  return NextResponse.json({ job });
}
