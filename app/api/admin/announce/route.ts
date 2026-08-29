import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { cuid } from "@/lib/id";
import { sendMail, onboardingEmail } from "@/lib/email";

type Employee = {
  id: string; name: string; email: string; title: string | null;
  department: string | null; location: string | null; start_date: string | null;
};

/** GET /api/admin/announce?employeeId=... — returns the composed email + candidate recipients. */
export async function GET(req: Request) {
  const guard = await requireAdmin("employees");
  if (guard instanceof Response) return guard;

  const url = new URL(req.url);
  const employeeId = url.searchParams.get("employeeId");
  if (!employeeId) return NextResponse.json({ error: "employeeId required." }, { status: 422 });

  const emp = await one<Employee>("SELECT * FROM employees WHERE id = $1", [employeeId]);
  if (!emp) return NextResponse.json({ error: "Employee not found." }, { status: 404 });

  const { subject, text, html } = onboardingEmail({
    name: emp.name, title: emp.title, department: emp.department,
    location: emp.location, startDate: emp.start_date,
  });

  // Candidate recipients: all active employees (except the new hire) + all admins.
  const employees = await q<{ name: string; email: string }>(
    "SELECT name, email FROM employees WHERE status = 'active' AND id <> $1 ORDER BY name", [employeeId]
  );
  const admins = await q<{ name: string; email: string }>("SELECT name, email FROM admins ORDER BY name");

  return NextResponse.json({
    employee: { id: emp.id, name: emp.name },
    email: { subject, text, html },
    candidates: {
      employees,
      admins,
    },
  });
}

/** POST — sends the announcement to the chosen recipients and logs it. */
export async function POST(req: Request) {
  const guard = await requireAdmin("employees");
  if (guard instanceof Response) return guard;

  const body = await req.json().catch(() => ({}));
  const employeeId = String(body.employeeId ?? "");
  const recipients: string[] = Array.isArray(body.recipients)
    ? body.recipients.map((r: unknown) => String(r).trim().toLowerCase()).filter(Boolean)
    : [];
  const subject = String(body.subject ?? "").trim();
  const text = String(body.text ?? "");
  const html = body.html ? String(body.html) : undefined;

  if (!recipients.length) return NextResponse.json({ error: "Pick at least one recipient." }, { status: 422 });
  if (!subject) return NextResponse.json({ error: "Subject required." }, { status: 422 });

  const result = await sendMail({ to: recipients, subject, text, html });

  const status = result.ok ? (result.mode === "json" ? "skipped" : "sent") : "failed";
  await q(
    `INSERT INTO announcements (id, employee_id, subject, body, recipients, sent_count, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [cuid(), employeeId || null, subject, text, JSON.stringify(recipients), result.accepted.length, status]
  );

  return NextResponse.json({
    ok: result.ok,
    mode: result.mode, // 'smtp' = really sent, 'json' = composed only (no SMTP configured)
    sent: result.accepted.length,
    recipients,
    error: result.error,
    note:
      result.mode === "json"
        ? "SMTP is not configured, so the email was composed but not delivered. Set SMTP_* env vars to send for real."
        : undefined,
  });
}
