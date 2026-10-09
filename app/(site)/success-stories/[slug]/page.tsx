import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import { getCaseStudies } from "@/lib/site";
import { PRISM_TEXT, PRISM_VAR } from "@/lib/data";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

export const revalidate = 60;

export async function generateStaticParams() {
  const stories = await getCaseStudies();
  return stories.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = (await getCaseStudies()).find((x) => x.id === slug);
  if (!c) return { title: "Partner Success Story" };
  return { title: c.title, description: (c.outcome || c.challenge).slice(0, 155) };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stories = await getCaseStudies();
  const i = stories.findIndex((x) => x.id === slug);
  if (i === -1) notFound();
  const c = stories[i];
  const others = stories.filter((x) => x.id !== slug).slice(0, 3);
  const accent = i % 6;

  /* The three beats of the story, rendered only where there is something to
     say — a half-filled record should not leave empty headings on the page. */
  const beats = [
    { label: "The challenge", body: c.challenge },
    { label: "Our approach", body: c.approach },
    { label: "The solution", body: c.solution },
  ].filter((b) => b.body);

  return (
    <div style={{ "--page-accent": PRISM_VAR[accent] } as React.CSSProperties}>
      {/* ---- the picture carries the opening, the way a story should ---- */}
      <section className="relative pt-[9.375rem] sm:pt-[11.875rem] pb-0 overflow-hidden">
        {c.image && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt="" aria-hidden className="media-footage absolute inset-0 h-full w-full object-cover" />
            <span aria-hidden className="veil-y pointer-events-none absolute inset-0" />
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper via-paper/80 to-paper/40" />
          </>
        )}
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8 pb-16 sm:pb-16">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-7">
              <ol className="flex flex-wrap items-center gap-2 mono-label text-graphite">
                <li><Link href="/success-stories" className="hover:text-brand transition-colors">Partner Success Stories</Link></li>
                <li aria-hidden>/</li>
                <li className="label-accent">{c.industry || "Case study"}</li>
              </ol>
            </nav>
            <h1 className="display text-ink text-[9vw] sm:text-[6.5vw] lg:text-[5vw] leading-[0.98] max-w-4xl">
              {c.title}
            </h1>
            {c.client && <p className="mt-6 text-lg text-graphite">{c.client}</p>}
          </Reveal>
        </div>
      </section>

      {/* ---- the record strip a reader scans first ---- */}
      <section className="relative z-10 bg-surface border-y border-line">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <dl className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y divide-line lg:divide-y-0 lg:divide-x lg:divide-line">
            {[
              { k: "Industry", v: c.industry },
              { k: "Delivery model", v: c.deliveryModel },
              { k: "Technology", v: c.technology.join(", ") },
              { k: "Outcome", v: c.outcome },
            ]
              .filter((x) => x.v)
              .map((x) => (
                <div key={x.k} className="py-8 lg:px-8 first:lg:pl-0 last:lg:pr-0">
                  <dt className="mono-label label-accent">{x.k}</dt>
                  <dd className="mt-3 text-sm text-ink/80 leading-relaxed">{x.v}</dd>
                </div>
              ))}
          </dl>
        </div>
      </section>

      {/* ---- the story itself ---- */}
      <section className="relative z-10 bg-paper py-14 sm:py-18">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 space-y-14">
          {beats.map((b, n) => (
            <Reveal key={b.label} delay={n * 0.05}>
              <div className="grid lg:grid-cols-[0.3fr_0.7fr] gap-6 lg:gap-16 border-t border-line pt-10">
                <p className="mono-label label-accent">{b.label}</p>
                <p className="max-w-3xl text-lg sm:text-xl text-ink/80 leading-[1.8]">{b.body}</p>
              </div>
            </Reveal>
          ))}

          {c.technology.length > 0 && (
            <Reveal>
              <div className="grid lg:grid-cols-[0.3fr_0.7fr] gap-6 lg:gap-16 border-t border-line pt-10">
                <p className="mono-label label-accent">Technology</p>
                <div className="flex flex-wrap gap-2">
                  {c.technology.map((t) => (
                    <span key={t} className="mono-label text-graphite border border-line-blue rounded-full px-3 py-1.5">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ---- the client's own words, given room ---- */}
      {c.quote && (
        <section className="relative z-10 bg-paper-tint/55 py-14 sm:py-18">
          <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
            <Reveal variant="rise" duration={0.8}>
              <figure className="relative overflow-hidden rounded-[1.75rem] border border-line-blue/60 bg-surface px-7 py-12 sm:px-14 sm:py-16">
                <span aria-hidden className={`prism-wash-lg pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full ${PRISM_BG[accent]} blur-[120px]`} />
                <blockquote className="relative display text-2xl sm:text-4xl text-ink leading-[1.25] max-w-4xl">
                  “{c.quote}”
                </blockquote>
                {c.quoteBy && <figcaption className="relative mt-7 mono-label label-accent">{c.quoteBy}</figcaption>}
              </figure>
            </Reveal>
          </div>
        </section>
      )}

      {/* ---- the other stories ---- */}
      {others.length > 0 && (
        <section className="relative z-10 bg-paper py-14 sm:py-18 border-t border-line">
          <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <h2 className="display text-3xl sm:text-5xl text-ink">More stories</h2>
              <Link href="/success-stories" className="mono-label label-accent hover:text-brand transition-colors">
                All partner success stories →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o, n) => (
                <Reveal key={o.id} delay={n * 0.05} variant="rise">
                  <Link
                    href={`/success-stories/${o.id}`}
                    className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-brand/50"
                  >
                    {o.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={o.image} alt="" loading="lazy" decoding="async"
                        className="aspect-[16/10] w-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                    )}
                    <span className="p-6">
                      <span className={`mono-label ${PRISM_TEXT[(n + 1) % 6]}`}>{o.industry || "Case study"}</span>
                      <span className="display block text-xl text-ink mt-2 group-hover:text-brand transition-colors">{o.title}</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        eyebrow="Partner Success Stories"
        heading="Facing something similar?"
        body="Tell us where you are and we will say plainly whether this is work we have done before."
      />
    </div>
  );
}
