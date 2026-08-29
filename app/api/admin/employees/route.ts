import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { cuid } from "@/lib/id";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
type Employee = { id: string; name: string; email: string; title: string | null; department: string | null; location: string | null; start_date: string | null; status: string; photo_id: string | null; created_at: string };

export async function GET() {
  const guard = await requireAdmin("employees");
  if (guard instanceof Response) return guard;
  const employees = await q<Employee>("SELECT * FROM employees ORDER BY created_at DESC");
  return NextResponse.json({ employees });
}

export async function POST(req: Request) {
  const guard = await requireAdmin("employees");
  if (guard instanceof Response) return guard;
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const title = body.title ? String(body.title).trim() : null;
  const department = body.department ? String(body.department).trim() : null;
  const location = body.location ? String(body.location).trim() : null;
  const startDate = body.startDate ? String(body.startDate) : null;

  if (name.length < 2) return NextResponse.json({ error: "Name required." }, { status: 422 });
  if (!isEmail(email)) return NextResponse.json({ error: "Valid email required." }, { status: 422 });
  const exists = await one("SELECT id FROM employees WHERE email = $1", [email]);
  if (exists) return NextResponse.json({ error: "An employee with that email already exists." }, { status: 409 });

  const id = cuid();
  await q(
    `INSERT INTO employees (id, name, email, title, department, location, start_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [id, name, email, title, department, location, startDate]
  );
  const employee = await one<Employee>("SELECT * FROM employees WHERE id = $1", [id]);
  return NextResponse.json({ employee });
}
