/* Creates or refreshes the first admin from SEED_ADMIN_* env vars. Run: npm run seed */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { q, one } from "../lib/db";
import { cuid } from "../lib/id";

// bcrypt directly (not lib/auth) so this runs in plain Node without next/headers.
const hashPassword = (pw: string) => bcrypt.hash(pw, 12);

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@noblesoft.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe!2026";
  const name = process.env.SEED_ADMIN_NAME || "Noblesoft Admin";

  const hash = await hashPassword(password);
  const existing = await one<{ id: string }>("SELECT id FROM admins WHERE email = $1", [email]);

  if (existing) {
    await q(
      "UPDATE admins SET name = $2, password = $3, role = $4 WHERE email = $1",
      [email, name, hash, "owner"]
    );
    console.log(`✓ Updated owner admin: ${email}`);
    console.log(`  Password: ${password}  (change it after first login)`);
    process.exit(0);
  }

  await q(
    "INSERT INTO admins (id, email, name, password, role) VALUES ($1,$2,$3,$4,'owner')",
    [cuid(), email, name, hash]
  );
  console.log(`✓ Created owner admin: ${email}`);
  console.log(`  Password: ${password}  (change it after first login)`);
  process.exit(0);
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
