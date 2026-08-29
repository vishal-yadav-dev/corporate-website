import { q } from "@/lib/db";
import { cuid } from "@/lib/id";
import { bad, isEmail, toCsv } from "@/lib/http";

export type Subscriber = { id: string; email: string; status: string; created_at: string };

/** Public newsletter sign-up. */
export async function subscribe(body: Record<string, unknown>) {
  if (body.website) return { ok: true }; // honeypot
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!isEmail(email)) throw bad("Enter a valid email.");
  await q(
    `INSERT INTO subscribers (id, email, status) VALUES ($1,$2,'active')
     ON CONFLICT (email) DO UPDATE SET status = 'active'`,
    [cuid(), email]
  );
  return { ok: true };
}

export async function list(params: URLSearchParams) {
  const subs = await q<Subscriber>("SELECT * FROM subscribers ORDER BY created_at DESC");
  if (params.get("format") === "csv") {
    return toCsv(
      ["Email", "Status", "Subscribed"],
      subs.map((s) => [s.email, s.status, s.created_at]),
      "subscribers"
    );
  }
  return { subscribers: subs };
}

export async function remove(id: string) {
  await q("DELETE FROM subscribers WHERE id = $1", [id]);
  return { ok: true };
}
