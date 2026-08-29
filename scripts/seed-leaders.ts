/* Seeds the leadership team from lib/data.ts so /company#leadership is populated.
   Editable afterwards at /admin/leadership. Run: npm run seed:leaders */
import "dotenv/config";
import { q, one } from "../lib/db";
import { cuid } from "../lib/id";
import { LEADERSHIP } from "../lib/data";

async function main() {
  console.log("Seeding leadership team…");
  let i = 0;
  for (const p of LEADERSHIP) {
    const existing = await one<{ id: string }>("SELECT id FROM leaders WHERE name = $1", [p.name]);
    if (existing) {
      await q(
        "UPDATE leaders SET title=$2, bio=$3, linkedin_url=$4, sort_order=$5, updated_at=now() WHERE id=$1",
        [existing.id, p.role, p.bio, p.linkedin, i * 10]
      );
      console.log(`↻ ${p.name}`);
    } else {
      await q(
        `INSERT INTO leaders (id, name, title, bio, linkedin_url, sort_order, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,true)`,
        [cuid(), p.name, p.role, p.bio, p.linkedin, i * 10]
      );
      console.log(`✓ ${p.name}`);
    }
    i++;
  }
  console.log("✓ Done. Manage at /admin/leadership.");
  process.exit(0);
}

main().catch((e) => { console.error("Failed:", e); process.exit(1); });
