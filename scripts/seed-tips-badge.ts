import "dotenv/config";
import { readFileSync } from "node:fs";
import { q, one } from "../lib/db";
import { cuid } from "../lib/id";

/**
 * Stores the official TIPS "Awarded Vendor" mark in site_images so the site
 * serves it from the database like every other uploaded image, rather than
 * from a file checked into the repo.
 *
 * The source download is CMYK, which browsers render with inverted colour, so
 * the file passed in here must already be RGB. Idempotent on `slot`.
 */
const SLOT = "tips-awarded-vendor";

(async () => {
  const path = process.argv[2];
  if (!path) {
    console.error("usage: tsx scripts/seed-tips-badge.ts <path-to-rgb-jpeg>");
    process.exit(1);
  }

  const existing = await one<{ id: string }>("SELECT id FROM site_images WHERE slot = $1", [SLOT]);
  const data = readFileSync(path);
  const id = existing?.id ?? cuid();

  if (existing) {
    await q("UPDATE site_images SET data = $2, size = $3, mime_type = $4, alt = $5 WHERE id = $1",
      [id, data, data.length, "image/jpeg", "TIPS Awarded Vendor"]);
    console.log("updated", id, data.length, "bytes");
  } else {
    await q("INSERT INTO site_images (id, slot, alt, mime_type, data, size) VALUES ($1,$2,$3,$4,$5,$6)",
      [id, SLOT, "TIPS Awarded Vendor", "image/jpeg", data, data.length]);
    console.log("inserted", id, data.length, "bytes");
  }
  console.log("serve at /api/images/" + id);
  process.exit(0);
})();
