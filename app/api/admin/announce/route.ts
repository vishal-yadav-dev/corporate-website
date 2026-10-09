import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { cuid } from "@/lib/id";
import { announcementHtml } from "@/lib/email-shell";
import { mailFrom, sendMail, onboardingEmail, sortAddresses } from "@/lib/email";

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
    from: mailFrom(),
  });
}

/** POST — sends the announcement to the chosen recipients and logs it. */
export async function POST(req: Request) {
  const guard = await requireAdmin("employees");
  if (guard instanceof Response) return guard;

  const body = await req.json().catch(() => ({}));
  const employeeId = String(body.employeeId ?? "");
  /* `recipients` is the ticked colleagues plus anyone typed in by hand. */
  const toIn = sortAddresses(body.recipients);
  const ccIn = sortAddresses(body.cc);
  const bccIn = sortAddresses(body.bcc);
  const invalid = [...toIn.bad, ...ccIn.bad, ...bccIn.bad];
  if (invalid.length) {
    return NextResponse.json({ error: `Not a valid email address: ${invalid.join(", ")}` }, { status: 422 });
  }
  const recipients = toIn.ok;
  const subject = String(body.subject ?? "").trim();
  const text = String(body.text ?? "");
  /* Wrapped here from the text that was actually sent in. The modal used to
     post the original HTML back, so an edited message went out with the
     unedited wording in every mail client that shows HTML. */
  const html = text.trim() ? announcementHtml(text) : undefined;

  if (!recipients.length && !ccIn.ok.length && !bccIn.ok.length) {
    return NextResponse.json({ error: "Pick at least one recipient." }, { status: 422 });
  }
  if (!subject) return NextResponse.json({ error: "Subject required." }, { status: 422 });

  /* With no Cc or Bcc this is the same blind-copy blast as before. Once either
     is used the addressing is explicit, so colleagues go to Bcc alongside. */
  const extras = ccIn.ok.length || bccIn.ok.length;
  const result = extras
    ? await sendMail({ to: [], cc: ccIn.ok, bcc: [...new Set([...recipients, ...bccIn.ok])], subject, text, html })
    : await sendMail({ to: recipients, subject, text, html });

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
