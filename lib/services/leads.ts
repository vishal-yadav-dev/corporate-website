import { q } from "@/lib/db";
import { cuid } from "@/lib/id";
import { bad, isEmail, toCsv, HttpError } from "@/lib/http";

export type Lead = {
  id: string; source: string; name: string; email: string; company: string | null;
  phone: string | null; practice: string | null; message: string; status: string; created_at: string;
};

const STATUSES = ["new", "read", "archived"];

/** Public contact / enquiry form submission. */
export async function submit(body: Record<string, unknown>) {
  if (body.website) return { ok: true }; // honeypot

  const source = body.source === "enquiry" ? "enquiry" : "contact";
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const company = body.company ? String(body.company).trim() : null;
  const phone = body.phone ? String(body.phone).trim() : null;
  const practice = body.practice ? String(body.practice).trim() : null;
  const message = String(body.message ?? "").trim();

  if (name.length < 2) throw bad("Please enter your name.");
  if (!isEmail(email)) throw bad("Please enter a valid email.");
  if (message.length < 5) throw bad("Please add a short message.");

  await q(
    `INSERT INTO leads (id, source, name, email, company, phone, practice, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [cuid(), source, name, email, company, phone, practice, message]
  );
  return { ok: true };
}

export async function list(params: URLSearchParams) {
  const source = params.get("source");
  const status = params.get("status");
  const clauses: string[] = [];
  const args: unknown[] = [];
  if (source && source !== "all") { args.push(source); clauses.push(`source = $${args.length}`); }
  if (status && status !== "all") { args.push(status); clauses.push(`status = $${args.length}`); }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const leads = await q<Lead>(`SELECT * FROM leads ${where} ORDER BY created_at DESC`, args);

  if (params.get("format") === "csv") {
    return toCsv(
      ["Date", "Source", "Name", "Email", "Company", "Phone", "Practice", "Status", "Message"],
      leads.map((l) => [l.created_at, l.source, l.name, l.email, l.company, l.phone, l.practice, l.status, l.message]),
      "leads"
    );
  }
  return { leads };
}

export async function setStatus(id: string, status: string) {
  if (!STATUSES.includes(status)) throw bad("Invalid status.");
  await q("UPDATE leads SET status = $1 WHERE id = $2", [status, id]);
  return { ok: true };
}

export async function remove(id: string) {
  await q("DELETE FROM leads WHERE id = $1", [id]);
  return { ok: true };
}

export { HttpError };
