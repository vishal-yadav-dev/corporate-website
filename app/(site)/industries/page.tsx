import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import ConstellationField from "@/components/ConstellationField";
import { INDUSTRIES, PRISM_TEXT } from "@/lib/data";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

/* ISR: rendered once and reused for a minute, so a click is not waiting
   on a database round trip. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Industries",
  description: "Enterprise application delivery for utilities, manufacturing, warehousing, state & local government, and higher education.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Industries"
        vanta="net"
        title="Technology shaped by your industry."
        intro="Every industry has different operating models, regulatory environments, technology challenges, and business priorities. Our solutions are designed around those realities."
      />
      <section className="relative z-10 bg-surface pt-12 sm:pt-16 pb-16 sm:pb-20 overflow-hidden">
        <ConstellationField />
        {/* positioned, so the cards paint over the field rather than under it */}
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8 space-y-6 scene" style={{ perspective: 1400 }}>
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.id} delay={0.03}>
              <div
                id={ind.id}
                className="card-3d group scroll-mt-16 relative grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-center bg-paper border border-line rounded-3xl p-8 sm:p-12 overflow-hidden hover:border-brand/50"
              >
                <div
                  className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full ${PRISM_BG[i % 6]} opacity-[0.10] blur-[90px] group-hover:opacity-20 transition-opacity duration-500`}
                />
                <div className="relative">
                  <span className={`mono-label ${PRISM_TEXT[i % 6]}`}>Industry</span>
                  <h2 className="display text-4xl sm:text-6xl text-ink mt-5"><Link href={`/industries/${ind.id}`} className="hover:text-brand transition-colors">{ind.name}</Link></h2>
                  <p className="mt-3 text-accent-deep text-lg">{ind.line}</p>
                  <p className="mt-6 text-graphite leading-relaxed max-w-xl">{ind.body}</p>
                  <div className="mt-7 flex flex-wrap gap-2 max-w-xl">
                    {ind.capabilities.map((c) => (
                      <span key={c} className="mono-label text-graphite border border-line-blue rounded-full px-3 py-1.5 group-hover:border-brand/40 transition-colors">
                        {c}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/industries/${ind.id}`}
                    className="mt-7 inline-flex items-center gap-1.5 mono-label text-accent-deep hover:text-brand transition-colors"
                  >
                    Explore {ind.name} →
                  </Link>
                </div>
                <div className="relative lg:justify-self-end">
                  {ind.image ? (
                    <figure className="relative overflow-hidden rounded-2xl border border-line lg:w-[20rem]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ind.image}
                        alt={`${ind.name} technology work`}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5">
                        <p className="display text-2xl text-white leading-[1.05]">{ind.metric}</p>
                        <p className="mt-1 text-xs text-white/75">{ind.metricLabel}</p>
                      </figcaption>
                    </figure>
                  ) : (
                    <div className={`${PRISM_BG[i % 6]} text-white rounded-2xl p-8 sm:p-10 lg:w-[17.5rem] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)]`}>
                      <p className="display text-3xl sm:text-4xl leading-[1.05]">{ind.metric}</p>
                      <p className="mt-2 text-sm text-white/75">{ind.metricLabel}</p>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBanner
        eyebrow="Industries"
        heading="Discuss your industry technology initiative."
        body="Every industry has different operating models and constraints. Tell us yours and we will start from the problem, not the tool."
      />

    </>
  );
}
