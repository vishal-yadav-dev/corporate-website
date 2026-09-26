/* Snapshots all editable site content from the database to a JSON file so any
   content change can be rolled back. Run: npx tsx scripts/backup-content.ts */
import "dotenv/config";
import { writeFileSync } from "node:fs";
import { q } from "../lib/db";

const TABLES = ["practices", "staffing", "industries", "banners", "offices", "awards", "partners", "content", "leaders"];

(async () => {
  const dump: Record<string, unknown[]> = {};
  for (const t of TABLES) {
    try {
      dump[t] = await q(`SELECT * FROM ${t}`);
      console.log(`${t.padEnd(12)} ${dump[t].length} rows`);
    } catch {
      console.log(`${t.padEnd(12)} (table not present — skipped)`);
    }
  }
  const stamp = new Date().toISOString().slice(0, 10);
  const file = `db/backups/content-${stamp}.json`;
  writeFileSync(file, JSON.stringify(dump, null, 2));
  console.log(`\n✓ written: ${file}`);
  process.exit(0);
})();
