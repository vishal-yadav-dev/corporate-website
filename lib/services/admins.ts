import { q, one } from "@/lib/db";
import { cuid } from "@/lib/id";
import { hashPassword } from "@/lib/auth";
import { bad, conflict, forbidden, notFound } from "@/lib/http";
import { ALL_SECTION_KEYS } from "@/lib/permissions";
import { issueToken } from "@/lib/services/auth";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const ROLES = ["owner", "admin", "editor"];

type Actor = { sub: string; role: string };

function cleanPerms(role: string, raw: unknown): string[] {
  if (role !== "editor" || !Array.isArray(raw)) return [];
  return raw.map(String).filter((k) => (ALL_SECTION_KEYS as readonly string[]).includes(k));
}

export async function list() {
  const admins = await q(
    "SELECT id, email, name, role, permissions, created_at FROM admins ORDER BY created_at ASC"
  );
  return { admins, sections: ALL_SECTION_KEYS };
}

export async function create(actor: Actor, input: Record<string, unknown>) {
  const email = String(input.email ?? "").trim().toLowerCase();
  const name = String(input.name ?? "").trim();
  const role = ROLES.includes(String(input.role)) ? String(input.role) : "admin";
  const sendInvite = input.sendInvite !== false;
  const password = String(input.password ?? "");

  if (!isEmail(email)) throw bad("Valid email required.");
  if (name.length < 2) throw bad("Name required.");

  // Only an owner can create another owner.
  if (role === "owner" && actor.role !== "owner") {
    throw forbidden("Only an owner can create another owner.");
  }
  if (!sendInvite && password.length < 8) {
    throw bad("Set a password of 8+ characters, or send an invite email instead.");
  }
  if (await one("SELECT id FROM admins WHERE email = $1", [email])) {
    throw conflict("That email already has an account.");
  }

  const id = cuid();
  const permissions = cleanPerms(role, input.permissions);
  const pw = sendInvite ? "" : await hashPassword(password);
  await q(
    "INSERT INTO admins (id, email, name, password, role, permissions) VALUES ($1,$2,$3,$4,$5,$6)",
    [id, email, name, pw, role, JSON.stringify(permissions)]
  );

  let invite: Awaited<ReturnType<typeof issueToken>> | null = null;
  if (sendInvite) {
    try { invite = await issueToken(id, "invite"); }
    catch (e) { console.error("invite email failed", e); }
  }

  return { admin: { id, email, name, role, permissions }, invite };
}

export async function updateRole(actor: Actor, id: string, input: Record<string, unknown>) {
  const target = await one<{ role: string }>("SELECT role FROM admins WHERE id = $1", [id]);
  if (!target) throw notFound();

  // Owner accounts are immutable — nobody can edit an owner's role.
  if (target.role === "owner") {
    throw forbidden("An owner's role can't be changed.");
  }
  const role = ROLES.includes(String(input.role)) ? String(input.role) : "admin";
  // Only an owner can promote someone to owner.
  if (role === "owner" && actor.role !== "owner") {
    throw forbidden("Only an owner can grant owner access.");
  }

  const permissions = cleanPerms(role, input.permissions);
  await q("UPDATE admins SET role = $1, permissions = $2 WHERE id = $3", [
    role, JSON.stringify(permissions), id,
  ]);
  return { ok: true };
}

export async function remove(actor: Actor, id: string) {
  const target = await one<{ role: string }>("SELECT role FROM admins WHERE id = $1", [id]);
  if (!target) throw notFound();

  // An owner can only be removed by that owner themselves.
  if (target.role === "owner" && actor.sub !== id) {
    throw forbidden("An owner can only be removed by that owner.");
  }
  if (target.role !== "owner" && actor.role === "editor") {
    throw forbidden("You can't remove other users.");
  }

  const count = Number(
    (await one<{ n: string }>("SELECT COUNT(*)::int AS n FROM admins"))?.n ?? 0
  );
  if (count <= 1) throw bad("At least one admin account must remain.");

  // Never leave the system with zero owners.
  if (target.role === "owner") {
    const owners = Number(
      (await one<{ n: string }>("SELECT COUNT(*)::int AS n FROM admins WHERE role = 'owner'"))?.n ?? 0
    );
    if (owners <= 1) throw bad("You're the only owner — add another owner before removing this account.");
  }

  await q("DELETE FROM admins WHERE id = $1", [id]);
  return { ok: true };
}

/** Re-send an invite / send a reset link for an existing admin. */
export async function resendInvite(actor: Actor, id: string) {
  const target = await one<{ role: string }>("SELECT role FROM admins WHERE id = $1", [id]);
  if (!target) throw notFound();
  const res = await issueToken(id, "invite");
  return res;
}
