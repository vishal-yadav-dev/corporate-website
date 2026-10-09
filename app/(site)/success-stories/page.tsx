import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import LinkPending from "@/components/LinkPending";
import { getCaseStudies } from "@/lib/site";
import { PRISM_TEXT, PRISM_VAR } from "@/lib/data";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

export const metadata: Metadata = {
  title: "Partner Success Stories",
  description:
    "What the work looked like: the challenge, the approach, and what changed afterwards, told one engagement at a time.",
};

/* ISR: stories are edited in /admin/site. */
export const revalidate = 60;

export default async function SuccessStoriesPage() {
  const stories = await getCaseStudies();

  return (
    <div style={{ "--page-accent": PRISM_VAR[4] } as React.CSSProperties}>
      <PageHeader
        eyebrow="Partner Success Stories"
        flow
        title="The work, told one engagement at a time"
        intro="Each story follows the same shape: what the organisation was facing, how we approached it, and what was different afterwards."
      />

      <section className="relative z-10 bg-surface pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          {stories.length === 0 ? (
            <p className="text-graphite">Stories are being prepared. Check back shortly.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((c, i) => (
                <Reveal key={c.id} delay={(i % 3) * 0.06} variant="rise">
                  <Link
                    href={`/success-stories/${c.id}`}
                    className="card-lift group relative flex h-full flex-col overflow-hidden rounded-[1.375rem] border border-line bg-paper transition-colors hover:border-brand/50"
                  >
                    {/* The picture leads, the way a story card should. */}
                    {c.image ? (
                      <span className="relative block overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="aspect-[16/10] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                        />
                      </span>
                    ) : (
                      <span aria-hidden className={`block aspect-[16/10] w-full ${PRISM_BG[i % 6]} opacity-20`} />
                    )}

                    <span className="flex flex-1 flex-col p-7">
                      <span className={`mono-label ${PRISM_TEXT[i % 6]}`}>{c.industry || "Case study"}</span>
                      <span className="display mt-3 text-2xl text-ink leading-[1.15] group-hover:text-brand transition-colors">
                        {c.title}
                      </span>
                      {c.outcome && (
                        <span className="mt-3 text-sm text-graphite leading-relaxed line-clamp-3">{c.outcome}</span>
                      )}
                      <span className="mt-6 inline-flex items-center gap-2 mono-label label-accent group-hover:text-brand transition-colors">
                        Read the story
                        <LinkPending />
                        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBanner
        eyebrow="Partner Success Stories"
        heading="Have a programme like one of these?"
        body="Tell us what you are facing and we will say plainly whether it is work we have done before."
      />
    </div>
  );
}
