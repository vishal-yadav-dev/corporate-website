import { NextResponse } from "next/server";
import { q } from "@/lib/db";

type JobCard = {
  id: string;
  title: string;
  slug: string;
  practice: string | null;
  location: string | null;
  employment_type: string;
  workplace: string;
  experience: string | null;
  summary: string;
  sort_order: number;
};

export async function GET() {
  const jobs = await q<JobCard>(`
    SELECT id, title, slug, practice, location, employment_type, workplace, experience, summary, sort_order
    FROM jobs
    WHERE status = 'published'
    ORDER BY sort_order ASC, created_at DESC
  `);
  return NextResponse.json({ jobs });
}
