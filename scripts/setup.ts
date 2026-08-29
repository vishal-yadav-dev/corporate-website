/* Applies db/schema.sql. Run: npm run db:setup */
import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { db } from "../lib/db";

async function main() {
  const sql = readFileSync(join(process.cwd(), "db", "schema.sql"), "utf8");
  const client = await db();
  // PGlite and pg both accept multi-statement strings via a single query in most cases;
  // split on semicolons at line ends to be safe across drivers.
  const statements = sql
    .split(/;\s*$/m)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    await client.query(stmt);
  }
  console.log(`✓ Applied ${statements.length} schema statements.`);
  process.exit(0);
}

main().catch((e) => {
  console.error("Schema setup failed:", e);
  process.exit(1);
});
