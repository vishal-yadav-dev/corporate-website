import { q } from "@/lib/db";
import { bad } from "@/lib/http";

/** Public — flat key→value map of editable copy. */
export async function map() {
  const rows = await q<{ key: string; value: string }>("SELECT key, value FROM content");
  const out: Record<string, string> = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export async function list() {
  const content = await q<{ key: string; value: string; updated_at: string }>(
    "SELECT * FROM content ORDER BY key ASC"
  );
  return { content };
}

export async function save(body: Record<string, unknown>) {
  const entries = body.entries as { key: string; value: string }[] | undefined;
  if (!Array.isArray(entries)) throw bad("Invalid payload.");
  for (const e of entries) {
    await q(
      `INSERT INTO content (key, value) VALUES ($1,$2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [e.key, String(e.value ?? "")]
    );
  }
  return { ok: true };
}
