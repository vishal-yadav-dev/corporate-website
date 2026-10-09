import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getSiteMap } from "@/lib/sitemap";
import { PRISM_VAR } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Every page on the site, in one list.",
  alternates: { canonical: "/sitemap" },
};

export const revalidate = 60;

export default async function SitemapPage() {
  const groups = await getSiteMap();
  return (
    <>
      <PageHeader eyebrow="Sitemap" title="Every page, in one place" />
      <div className="relative z-10 bg-paper pb-16 sm:pb-24">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <section key={g.title} style={{ "--page-accent": PRISM_VAR[i % 6] } as React.CSSProperties}>
              <h2 className="mono-label label-accent pb-3 border-b border-line">{g.title}</h2>
              <ul className="mt-3">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block py-1.5 text-ink/80 hover:text-brand transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
