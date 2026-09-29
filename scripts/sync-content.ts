/* Pushes the practices and solutions copy from lib/data.ts into the database,
   which is what the live site actually reads. Renamed entries are matched
   through RENAMES; anything no longer in lib/data.ts is deactivated rather
   than deleted, so it can be switched back on.
   Run: npx tsx scripts/sync-content.ts */
import "dotenv/config";
import { q, one } from "../lib/db";
import { cuid } from "../lib/id";
import { PRACTICES, STAFFING, PRACTICE_LOGOS } from "../lib/data";

const RENAMES: Record<string, string> = {
  integration: "enterprise-integration",
  contract: "staff-augmentation",
  sow: "sow-project-teams",
  "msp-vms": "managed-workforce",
  compliance: "contingent-workforce",
};

async function renameSlugs(table: string) {
  for (const [from, to] of Object.entries(RENAMES)) {
    if (await one(`SELECT id FROM ${table} WHERE slug = $1`, [from])) {
      await q(`UPDATE ${table} SET slug = $1 WHERE slug = $2`, [to, from]);
    }
  }
}

(async () => {
  await renameSlugs("practices");
  await renameSlugs("staffing");

  let i = 0;
  for (const p of PRACTICES) {
    const logo = PRACTICE_LOGOS[p.id] ?? "";
    const row = await one<{ id: string }>("SELECT id FROM practices WHERE slug = $1", [p.id]);
    if (row) {
      await q(
        `UPDATE practices SET name=$2, tag=$3, body=$4, stack=$5, sort_order=$6, is_active=true, updated_at=now() WHERE id=$1`,
        [row.id, p.name, p.tag, p.body, p.stack.join(", "), i * 10]
      );
    } else {
      await q(
        `INSERT INTO practices (id, slug, name, tag, body, stack, logo_url, sort_order, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true)`,
        [cuid(), p.id, p.name, p.tag, p.body, p.stack.join(", "), logo, i * 10]
      );
    }
    i++;
  }
  const keepP = PRACTICES.map((p) => p.id);
  await q(`UPDATE practices SET is_active = false WHERE slug <> ALL($1)`, [keepP]);
  console.log(`practices  ${PRACTICES.length} synced`);

  i = 0;
  for (const s of STAFFING) {
    const row = await one<{ id: string }>("SELECT id FROM staffing WHERE slug = $1", [s.id]);
    if (row) {
      await q(
        `UPDATE staffing SET name=$2, line=$3, body=$4, points=$5, sort_order=$6, is_active=true, updated_at=now() WHERE id=$1`,
        [row.id, s.name, s.line, s.body, s.points.join("\n"), i * 10]
      );
    } else {
      await q(
        `INSERT INTO staffing (id, slug, name, line, body, points, sort_order, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,true)`,
        [cuid(), s.id, s.name, s.line, s.body, s.points.join("\n"), i * 10]
      );
    }
    i++;
  }
  const keepS = STAFFING.map((s) => s.id);
  await q(`UPDATE staffing SET is_active = false WHERE slug <> ALL($1)`, [keepS]);
  console.log(`staffing   ${STAFFING.length} synced`);
  process.exit(0);
})();
