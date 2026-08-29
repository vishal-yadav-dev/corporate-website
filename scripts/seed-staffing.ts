import "dotenv/config";
import { q, one } from "../lib/db";
import { cuid } from "../lib/id";
import { STAFFING } from "../lib/data";
import { slugify } from "../lib/jobs";
(async () => {
  let i = 0;
  for (const s of STAFFING) {
    const slug = slugify(s.id || s.name);
    if (await one("SELECT id FROM staffing WHERE slug = $1", [slug])) { i++; continue; }
    await q(
      `INSERT INTO staffing (id, slug, name, line, body, points, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,true)`,
      [cuid(), slug, s.name, s.line, s.body, s.points.join("\n"), i * 10]
    );
    i++;
  }
  console.log("✓ staffing seeded (" + STAFFING.length + ")");
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
