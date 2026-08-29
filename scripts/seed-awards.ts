import "dotenv/config";
import { q, one } from "../lib/db";
import { cuid } from "../lib/id";
import { AWARDS } from "../lib/data";
(async () => {
  let i = 0;
  for (const a of AWARDS) {
    if (await one("SELECT id FROM awards WHERE title = $1", [a.title])) { i++; continue; }
    await q("INSERT INTO awards (id, year, title, sort_order, is_active) VALUES ($1,$2,$3,$4,true)",
      [cuid(), a.year, a.title, i * 10]);
    i++;
  }
  console.log("✓ awards seeded (" + AWARDS.length + ")");
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
