/* Seeds partners, offices, and practices from lib/data.ts so the admin
   Site-content screens start populated. Editable at /admin/site.
   Run: npm run seed:site */
import "dotenv/config";
import { q, one } from "../lib/db";
import { cuid } from "../lib/id";
import { PARTNERS, LOCATIONS, PRACTICES, PRACTICE_LOGOS } from "../lib/data";
import { slugify } from "../lib/jobs";

async function main() {
  console.log("Seeding site content…");

  let i = 0;
  for (const p of PARTNERS) {
    if (await one("SELECT id FROM partners WHERE name = $1", [p.name])) { i++; continue; }
    await q(
      `INSERT INTO partners (id, name, kind, logo_url, sort_order, is_active)
       VALUES ($1,$2,'partner',$3,$4,true)`,
      [cuid(), p.name, p.logo, i * 10]
    );
    i++;
  }
  console.log(`✓ partners (${PARTNERS.length})`);

  i = 0;
  for (const l of LOCATIONS) {
    if (await one("SELECT id FROM offices WHERE region = $1", [l.region])) { i++; continue; }
    await q(
      `INSERT INTO offices (id, region, role, address, tel, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,true)`,
      [cuid(), l.region, l.role, l.address, l.tel, i * 10]
    );
    i++;
  }
  console.log(`✓ offices (${LOCATIONS.length})`);

  i = 0;
  for (const p of PRACTICES) {
    const slug = slugify(p.id || p.name);
    if (await one("SELECT id FROM practices WHERE slug = $1", [slug])) { i++; continue; }
    await q(
      `INSERT INTO practices (id, slug, name, tag, body, stack, logo_url, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true)`,
      [cuid(), slug, p.name, p.tag, p.body, p.stack.join(", "), PRACTICE_LOGOS[p.id] || "", i * 10]
    );
    i++;
  }
  console.log(`✓ practices (${PRACTICES.length})`);

  console.log("✓ Done. Manage at /admin/site.");
  process.exit(0);
}

main().catch((e) => { console.error("Failed:", e); process.exit(1); });
