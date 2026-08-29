import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { q, one } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { cuid } from "@/lib/id";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const MAX_BYTES = 5 * 1024 * 1024;

function pick(row: Record<string, unknown>, keys: string[]): string {
  for (const k of Object.keys(row)) {
    if (keys.includes(k.trim().toLowerCase())) return String(row[k] ?? "").trim();
  }
  return "";
}

function toDate(v: string): string | null {
  if (!v) return null;
  // Accept YYYY-MM-DD or common locale strings; XLSX may already give an ISO string.
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

export async function POST(req: Request) {
  const guard = await requireAdmin("employees");
  if (guard instanceof Response) return guard;

  let form: FormData;
  try { form = await req.formData(); } catch { return NextResponse.json({ error: "Invalid upload." }, { status: 400 }); }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Attach a .xlsx or .csv file." }, { status: 422 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File exceeds 5MB." }, { status: 422 });

  let rows: Record<string, unknown>[];
  try {
    const wb = XLSX.read(Buffer.from(await file.arrayBuffer()), { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  } catch {
    return NextResponse.json({ error: "Could not read that spreadsheet." }, { status: 422 });
  }

  const created: string[] = [];
  const skipped: { row: number; reason: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const name = pick(r, ["name", "full name", "employee name"]);
    const email = pick(r, ["email", "work email", "email address"]).toLowerCase();
    const title = pick(r, ["title", "designation", "role"]);
    const department = pick(r, ["department", "dept", "practice"]);
    const location = pick(r, ["location", "office", "city"]);
    const startDate = toDate(pick(r, ["start_date", "start date", "joining date", "doj"]));
    const line = i + 2; // header is row 1

    if (!name && !email) continue; // blank row
    if (name.length < 2) { skipped.push({ row: line, reason: "missing name" }); continue; }
    if (!isEmail(email)) { skipped.push({ row: line, reason: "invalid email" }); continue; }
    if (await one("SELECT id FROM employees WHERE email = $1", [email])) {
      skipped.push({ row: line, reason: "email already exists" });
      continue;
    }

    await q(
      `INSERT INTO employees (id, name, email, title, department, location, start_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [cuid(), name, email, title || null, department || null, location || null, startDate]
    );
    created.push(name);
  }

  return NextResponse.json({
    ok: true,
    createdCount: created.length,
    skippedCount: skipped.length,
    created,
    skipped,
  });
}
