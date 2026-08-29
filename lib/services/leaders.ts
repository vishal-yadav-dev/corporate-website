import { q, one } from "@/lib/db";
import { cuid } from "@/lib/id";
import { bad, notFound } from "@/lib/http";

export type Leader = {
  id: string; name: string; title: string; bio: string; linkedin_url: string;
  photo_id: string | null; photo_url: string; sort_order: number; is_active: boolean;
};

function read(body: Record<string, unknown>) {
  return {
    name: String(body.name ?? "").trim(),
    title: String(body.title ?? "").trim(),
    bio: String(body.bio ?? "").trim(),
    linkedin_url: String(body.linkedin_url ?? "").trim(),
    photo_id: body.photo_id ? String(body.photo_id) : null,
    photo_url: String(body.photo_url ?? "").trim(),
    is_active: typeof body.is_active === "boolean" ? body.is_active : true,
    sort_order: Number.isFinite(Number(body.sort_order)) ? parseInt(String(body.sort_order), 10) || 0 : 0,
  };
}

/** Public — active leaders for the Company page. */
export async function publicList() {
  const leaders = await q<Leader>(
    `SELECT id, name, title, bio, linkedin_url, photo_id, photo_url, sort_order
     FROM leaders WHERE is_active = true ORDER BY sort_order ASC, created_at ASC`
  );
  return { leaders };
}

export async function list() {
  const leaders = await q<Leader>("SELECT * FROM leaders ORDER BY sort_order ASC, created_at ASC");
  return { leaders };
}

export async function create(body: Record<string, unknown>) {
  const v = read(body);
  if (!v.name) throw bad("Name is required.");
  const id = cuid();
  await q(
    `INSERT INTO leaders (id, name, title, bio, linkedin_url, photo_id, photo_url, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [id, v.name, v.title, v.bio, v.linkedin_url, v.photo_id, v.photo_url, v.sort_order, v.is_active]
  );
  return { leader: await one<Leader>("SELECT * FROM leaders WHERE id = $1", [id]) };
}

export async function update(id: string, body: Record<string, unknown>) {
  const v = read(body);
  if (!v.name) throw bad("Name is required.");
  await q(
    `UPDATE leaders SET name=$1, title=$2, bio=$3, linkedin_url=$4, photo_id=$5, photo_url=$6,
       sort_order=$7, is_active=$8, updated_at=now() WHERE id=$9`,
    [v.name, v.title, v.bio, v.linkedin_url, v.photo_id, v.photo_url, v.sort_order, v.is_active, id]
  );
  const leader = await one<Leader>("SELECT * FROM leaders WHERE id = $1", [id]);
  if (!leader) throw notFound();
  return { leader };
}

export async function remove(id: string) {
  await q("DELETE FROM leaders WHERE id = $1", [id]);
  return { ok: true };
}
