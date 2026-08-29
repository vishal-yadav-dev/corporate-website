import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { cuid } from "@/lib/id";
import { CV_ALLOWED_MIME, CV_MAX_BYTES } from "@/lib/jobs";
import { sendMail } from "@/lib/email";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (form.get("website")) return NextResponse.json({ ok: true }); // honeypot

  const jobId = form.get("job_id") ? String(form.get("job_id")) : null;
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = form.get("phone") ? String(form.get("phone")).trim() : null;
  const location = form.get("location") ? String(form.get("location")).trim() : null;
  const linkedinUrl = form.get("linkedin_url") ? String(form.get("linkedin_url")).trim() : null;
  const coverNote = form.get("cover_note") ? String(form.get("cover_note")).trim() : null;
  const cv = form.get("cv");

  if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 422 });
  if (!isEmail(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 422 });
  if (!(cv instanceof File) || cv.size === 0) {
    return NextResponse.json({ error: "Please attach your CV." }, { status: 422 });
  }
  if (!CV_ALLOWED_MIME.includes(cv.type)) {
    return NextResponse.json({ error: "CV must be a PDF or Word document." }, { status: 422 });
  }
  if (cv.size > CV_MAX_BYTES) {
    return NextResponse.json({ error: "CV exceeds the 10MB limit." }, { status: 422 });
  }

  let jobTitle = "";
  if (jobId) {
    const job = await one<{ title: string }>("SELECT title FROM jobs WHERE id = $1", [jobId]);
    jobTitle = job?.title ?? "";
  }

  const bytes = Buffer.from(await cv.arrayBuffer());
  const id = cuid();

  try {
    await q(
      `INSERT INTO applications
        (id, job_id, job_title, name, email, phone, location, linkedin_url, cover_note,
         cv_filename, cv_mime_type, cv_data, cv_size)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        id, jobId, jobTitle, name, email, phone, location, linkedinUrl, coverNote,
        cv.name || "cv", cv.type, bytes, cv.size,
      ]
    );
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // Best-effort notification to admins (composed only if SMTP is unset).
  try {
    const admins = await q<{ email: string }>("SELECT email FROM admins");
    const to = admins.map((a) => a.email).filter(Boolean);
    if (to.length) {
      const subject = `New application${jobTitle ? ` — ${jobTitle}` : ""}: ${name}`;
      const text = [
        `A new candidate applied${jobTitle ? ` for ${jobTitle}` : ""}.`,
        ``,
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : "",
        location ? `Location: ${location}` : "",
        linkedinUrl ? `LinkedIn: ${linkedinUrl}` : "",
        coverNote ? `\nNote:\n${coverNote}` : "",
        ``,
        `Review it in the admin hub: /admin/applications`,
      ]
        .filter(Boolean)
        .join("\n");
      await sendMail({ to, subject, text });
    }
  } catch {
    // notification failure must not fail the application
  }

  return NextResponse.json({ ok: true });
}
