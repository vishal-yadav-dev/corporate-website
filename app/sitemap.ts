import type { MetadataRoute } from "next";
import { getSiteMap } from "@/lib/sitemap";
import { siteUrl } from "@/lib/jobs";

/* /sitemap.xml for search engines. Same list as the /sitemap page. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const seen = new Set<string>();
  return (await getSiteMap())
    .flatMap((g) => g.links)
    .filter((l) => (seen.has(l.href) ? false : (seen.add(l.href), true)))
    .map((l) => ({ url: `${base}${l.href === "/" ? "" : l.href}` }));
}
