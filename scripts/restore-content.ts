/* Restores site content from a backup written by scripts/backup-content.ts.
   Each listed table is emptied and rewritten from the snapshot, so anything
   added after the backup is lost — that is what makes it a true rollback.

   Run: npx tsx scripts/restore-content.ts db/backups/content-2026-09-26.json
        npx tsx scripts/restore-content.ts <file> practices staffing   (subset) */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { q } from "../lib/db";

(async () => {
  const [file, ...only] = process.argv.slice(2);
  if (!file) { console.error("Usage: restore-content.ts <backup.json> [table ...]"); process.exit(1); }

  const dump = JSON.parse(readFileSync(file, "utf8")) as Record<string, Record<string, unknown>[]>;
  const tables = only.length ? only : Object.keys(dump);

  for (const t of tables) {
    const rows = dump[t];
    if (!rows) { console.log(`${t.padEnd(12)} not in backup — skipped`); continue; }
    await q(`DELETE FROM ${t}`);
    for (const row of rows) {
      const cols = Object.keys(row);
      const ph = cols.map((_, i) => `$${i + 1}`).join(",");
      await q(`INSERT INTO ${t} (${cols.join(",")}) VALUES (${ph})`, cols.map((c) => row[c]));
    }
    console.log(`${t.padEnd(12)} restored ${rows.length} rows`);
  }
  console.log("\n✓ restore complete");
  process.exit(0);
})();
