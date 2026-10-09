import "server-only";
import { q } from "@/lib/db";
import { INDUSTRIES } from "@/lib/data";
import { ALL_VEHICLES } from "@/lib/contracts";
import { getBlogPosts, getCaseStudies, getLegalPages, getPractices, getStaffing } from "@/lib/site";

/**
 * Every public page, grouped.
 *
 * One list feeds both the /sitemap page people read and the /sitemap.xml search
 * engines read, so the two cannot disagree. It is built from the same loaders
 * the pages use: a practice, post, story or job added in the admin shows up
 * here without anyone editing a list.
 */
export type SiteLink = { label: string; href: string };
export type SiteGroup = { title: string; links: SiteLink[] };

async function publishedJobs(): Promise<SiteLink[]> {
  try {
    const rows = await q<{ slug: string; title: string }>(
      "SELECT slug, title FROM jobs WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC"
    );
    return rows.map((j) => ({ label: j.title, href: `/careers/${j.slug}` }));
  } catch {
    return [];
  }
}

export async function getSiteMap(): Promise<SiteGroup[]> {
  const [practices, solutions, posts, stories, legal, jobs] = await Promise.all([
    getPractices(), getStaffing(), getBlogPosts(), getCaseStudies(), getLegalPages(), publishedJobs(),
  ]);

  const groups: SiteGroup[] = [
    {
      title: "Main",
      links: [
        { label: "Home", href: "/" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "About Us",
      links: [
        { label: "Who We Are", href: "/company" },
        { label: "Our Vision", href: "/company/our-vision" },
        { label: "Diversity & Inclusion", href: "/company/diversity-inclusion" },
        { label: "Contract Vehicles", href: "/company/contract-vehicles" },
        ...ALL_VEHICLES.map((v) => ({ label: v.name, href: `/company/contract-vehicles/${v.id}` })),
      ],
    },
    {
      title: "Practices",
      links: [
        { label: "All practices", href: "/practices" },
        ...practices.map((p) => ({ label: p.name, href: `/practices/${p.id}` })),
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "All solutions", href: "/solutions" },
        ...solutions.map((s) => ({ label: s.name, href: `/solutions/${s.group}-solutions/${s.id}` })),
      ],
    },
    {
      title: "Industries",
      links: [
        { label: "All industries", href: "/industries" },
        ...INDUSTRIES.map((i) => ({ label: i.name, href: `/industries/${i.id}` })),
      ],
    },
    {
      title: "Success Stories",
      links: [
        { label: "All success stories", href: "/success-stories" },
        ...stories.map((c) => ({ label: c.title, href: `/success-stories/${c.id}` })),
      ],
    },
    {
      title: "Blog",
      links: [
        { label: "All posts", href: "/blog" },
        ...posts.map((p) => ({ label: p.title, href: `/blog/${p.slug}` })),
      ],
    },
    {
      title: "Careers",
      links: [{ label: "Careers", href: "/careers" }, ...jobs],
    },
    {
      title: "Legal",
      links: [
        ...legal.map((d) => ({ label: d.title, href: `/${d.slug}` })),
        { label: "Sitemap", href: "/sitemap" },
      ],
    },
  ];
  return groups;
}
