import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { INDUSTRIES, PRISM_TEXT } from "@/lib/data";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

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
        art="cubes"
        title="Where we go deep."
        intro="We build for regulated, high-volume environments — from grid-scale utilities to campus-wide student systems — pairing platform expertise with real operational context."
      />
      <section className="relative z-10 bg-surface pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 space-y-6 scene" style={{ perspective: 1400 }}>
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.id} delay={0.03}>
              <div
                id={ind.id}
                className="card-3d group scroll-mt-28 relative grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-center bg-paper border border-line rounded-3xl p-8 sm:p-12 overflow-hidden hover:border-brand/50"
              >
                <div
                  className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full ${PRISM_BG[i % 6]} opacity-[0.10] blur-[90px] group-hover:opacity-20 transition-opacity duration-500`}
                />
                <div className="relative">
                  <span className={`mono-label ${PRISM_TEXT[i % 6]}`}>Industry</span>
                  <h2 className="display text-4xl sm:text-6xl text-ink mt-5">{ind.name}</h2>
                  <p className="mt-3 text-accent-deep text-lg">{ind.line}</p>
                  <p className="mt-6 text-graphite leading-relaxed max-w-xl">{ind.body}</p>
                </div>
                <div className="relative lg:justify-self-end">
                  <div className={`${PRISM_BG[i % 6]} text-white rounded-2xl p-8 sm:p-10 lg:w-[280px] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)]`}>
                    <p className="display text-4xl sm:text-5xl">{ind.metric}</p>
                    <p className="mt-2 text-sm text-white/75">{ind.metricLabel}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
