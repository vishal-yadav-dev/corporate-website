import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";

type AppRow = {
  id: string;
  job_id: string | null;
  job_title: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  cover_note: string | null;
  cv_filename: string;
  cv_mime_type: string;
  cv_size: number;
  status: string;
  created_at: string;
};

export async function GET(req: Request) {
  const guard = await requireAdmin("applications");
  if (guard instanceof Response) return guard;

  const url = new URL(req.url);
  const jobId = url.searchParams.get("job_id");
  const status = url.searchParams.get("status");
  const format = url.searchParams.get("format");

  const clauses: string[] = [];
  const params: unknown[] = [];
  if (jobId && jobId !== "all") { params.push(jobId); clauses.push(`job_id = $${params.length}`); }
  if (status && status !== "all") { params.push(status); clauses.push(`status = $${params.length}`); }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const rows = await q<AppRow>(
    `SELECT id, job_id, job_title, name, email, phone, location, linkedin_url, cover_note,
            cv_filename, cv_mime_type, cv_size, status, created_at
     FROM applications ${where} ORDER BY created_at DESC`,
    params
  );

  if (format === "csv") {
    const header = ["Date", "Role", "Name", "Email", "Phone", "Location", "LinkedIn", "Status", "CV file", "Note"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = rows.map((r) =>
      [r.created_at, r.job_title, r.name, r.email, r.phone, r.location, r.linkedin_url, r.status, r.cv_filename, r.cover_note]
        .map(esc)
        .join(",")
    );
    const csv = [header.join(","), ...lines].join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="applications-${Date.now()}.csv"`,
      },
    });
  }

  // job list for the filter dropdown
  const jobs = await q<{ id: string; title: string }>(
    "SELECT id, title FROM jobs ORDER BY sort_order ASC, created_at DESC"
  );

  return NextResponse.json({ applications: rows, jobs });
}
