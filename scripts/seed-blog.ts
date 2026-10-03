/**
 * Seeds the blog.
 *
 * Idempotent on `slug`: re-running updates the row rather than creating a
 * second copy, so it is safe to run after editing the copy here. Posts added
 * through the admin are untouched.
 *
 *   npx tsx scripts/seed-blog.ts
 */
import "dotenv/config";
import { q, one } from "../lib/db";
import { cuid } from "../lib/id";
import { BLOG_POSTS } from "../lib/blog";

type Seed = {
  slug: string; title: string; tag: string; excerpt: string;
  image: string; imageAlt: string; date: string;
  author: { name: string; role: string }; accent: number;
  intro: string;
  sections: { heading?: string; paras?: string[]; list?: string[] }[];
  takeaways: string[];
};

async function upsert(p: Seed) {
  const existing = await one<{ id: string }>("SELECT id FROM blog_posts WHERE slug = $1", [p.slug]);
  const vals = [
    p.title, p.tag, p.excerpt, p.image, p.imageAlt,
    p.author.name, p.author.role, p.date, p.accent, p.intro,
    JSON.stringify(p.sections), JSON.stringify(p.takeaways),
  ];
  if (existing) {
    await q(
      `UPDATE blog_posts SET title=$1, tag=$2, excerpt=$3, image_url=$4, image_alt=$5,
       author_name=$6, author_role=$7, published_at=$8, accent=$9, intro=$10,
       sections_json=$11, takeaways_json=$12, updated_at=now() WHERE id=$13`,
      [...vals, existing.id]
    );
    return "updated";
  }
  await q(
    `INSERT INTO blog_posts (id, slug, title, tag, excerpt, image_url, image_alt,
     author_name, author_role, published_at, accent, intro, sections_json, takeaways_json,
     created_by, updated_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$15)`,
    [cuid(), p.slug, ...vals, "Seed script"]
  );
  return "inserted";
}

async function main() {
  /* One source of truth: the bundled posts in lib/blog.ts, which are also the
     fallback the site renders when the table is empty. */
  const all: Seed[] = BLOG_POSTS.map((p) => ({
    slug: p.slug, title: p.title, tag: p.tag, excerpt: p.excerpt,
    image: p.image, imageAlt: p.imageAlt, date: p.date,
    author: p.author, accent: p.accent, intro: p.intro,
    sections: p.sections, takeaways: p.takeaways,
  }));
  let ins = 0, upd = 0;
  for (const p of all) ((await upsert(p)) === "inserted" ? ins++ : upd++);
  console.log(`blog seed complete — ${ins} inserted, ${upd} updated, ${all.length} total`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
