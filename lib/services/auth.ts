import { randomBytes, createHash } from "crypto";
import { q, one } from "@/lib/db";
import { cuid } from "@/lib/id";
import { hashPassword, verifyPassword, createSession, destroySession } from "@/lib/auth";
import { bad, notFound, unauthorized, HttpError } from "@/lib/http";
import { sendMail } from "@/lib/email";
import { getTemplate, renderTemplate } from "@/lib/email-templates";
import { siteUrl } from "@/lib/jobs";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

const TTL: Record<string, number> = {
  reset: 60 * 60 * 1000, // 1 hour
  invite: 3 * 24 * 60 * 60 * 1000, // 3 days
};
const TTL_LABEL: Record<string, string> = { reset: "1 hour", invite: "3 days" };

type AdminRow = {
  id: string; email: string; name: string; role: string; permissions: string; password: string;
};

function parsePerms(raw: string) {
  try { const v = JSON.parse(raw || "[]"); return Array.isArray(v) ? v.map(String) : []; }
  catch { return []; }
}

export async function login(email: string, password: string) {
  email = String(email ?? "").trim().toLowerCase();
  password = String(password ?? "");
  if (!email || !password) throw bad("Email and password are required.");

  const admin = await one<AdminRow>(
    "SELECT id, email, name, role, permissions, password FROM admins WHERE email = $1",
    [email]
  );
  if (!admin || !admin.password || !(await verifyPassword(password, admin.password))) {
    throw unauthorized("Incorrect email or password.");
  }
  await createSession({
    sub: admin.id, email: admin.email, name: admin.name,
    role: admin.role, perms: parsePerms(admin.permissions),
  });
  return { ok: true };
}

export async function logout() {
  await destroySession();
  return { ok: true };
}

/** Create a one-time token, store its hash, email the link. Shared by invite + reset. */
export async function issueToken(adminId: string, purpose: "reset" | "invite") {
  const admin = await one<{ id: string; email: string; name: string; role: string }>(
    "SELECT id, email, name, role FROM admins WHERE id = $1",
    [adminId]
  );
  if (!admin) throw notFound("Account not found.");

  const raw = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TTL[purpose]);
  await q("DELETE FROM password_tokens WHERE admin_id = $1 AND purpose = $2", [adminId, purpose]);
  await q(
    `INSERT INTO password_tokens (id, admin_id, token_hash, purpose, expires_at)
     VALUES ($1,$2,$3,$4,$5)`,
    [cuid(), adminId, sha256(raw), purpose, expiresAt]
  );

  const actionUrl = `${siteUrl()}/admin/set-password?token=${raw}`;
  const slug = purpose === "invite" ? "admin-invite" : "password-reset";
  const tpl = await getTemplate(slug);
  const html = renderTemplate(tpl.html, {
    name: admin.name,
    role: admin.role,
    action_url: actionUrl,
    expiry: TTL_LABEL[purpose],
  });
  const text = `${purpose === "invite" ? "Set your Noblesoft admin password" : "Reset your Noblesoft admin password"}: ${actionUrl}`;
  const result = await sendMail({ to: [admin.email], subject: tpl.subject, text, html });

  return { sent: result.ok, mode: result.mode, actionUrl, email: admin.email };
}

/** Public: request a reset link. Always returns ok (no account enumeration). */
export async function requestReset(email: string) {
  email = String(email ?? "").trim().toLowerCase();
  if (!isEmail(email)) throw bad("Enter a valid email.");
  const admin = await one<{ id: string }>("SELECT id FROM admins WHERE email = $1", [email]);
  if (admin) {
    try { await issueToken(admin.id, "reset"); } catch (e) { console.error("reset issue failed", e); }
  }
  return { ok: true };
}

async function consumeToken(token: string) {
  const raw = String(token ?? "");
  if (raw.length < 20) throw bad("Invalid or expired link.");
  const row = await one<{ id: string; admin_id: string; expires_at: string; used_at: string | null }>(
    "SELECT id, admin_id, expires_at, used_at FROM password_tokens WHERE token_hash = $1",
    [sha256(raw)]
  );
  if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
    throw new HttpError(400, "This link is invalid or has expired. Request a new one.");
  }
  return row;
}

/** Check a token without spending it (for the set-password screen to load). */
export async function checkToken(token: string) {
  const row = await consumeToken(token);
  const admin = await one<{ email: string; name: string }>(
    "SELECT email, name FROM admins WHERE id = $1", [row.admin_id]
  );
  return { valid: true, email: admin?.email ?? "", name: admin?.name ?? "" };
}

export async function setPassword(token: string, password: string) {
  password = String(password ?? "");
  if (password.length < 8) throw bad("Password must be at least 8 characters.");
  const row = await consumeToken(token);
  await q("UPDATE admins SET password = $1 WHERE id = $2", [await hashPassword(password), row.admin_id]);
  await q("UPDATE password_tokens SET used_at = now() WHERE id = $1", [row.id]);
  return { ok: true };
}
