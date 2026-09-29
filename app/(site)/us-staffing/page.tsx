import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import VantaBg from "@/components/VantaBg";
import PartnerStrip from "@/components/PartnerStrip";
import CtaBanner from "@/components/CtaBanner";
import { STAFFING_STATS, PRISM_TEXT } from "@/lib/data";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];
import { getStaffing } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Testsoft staff augmentation — contract staffing, direct hire, SOW delivery pods, MSP/VMS program management, and compliant payrolling across all 50 states.",
};

export default async function UsStaffingPage() {
  const ALL = await getStaffing();
  const GROUPS = [
    { key: "technology", title: "Technology Solutions", blurb: "From enterprise platforms to digital engineering and integration — turning complex technology challenges into scalable business solutions." },
    { key: "workforce", title: "Workforce Solutions", blurb: "Great technology strategies require the right people to execute them. Flexible models for accessing specialized technology talent." },
  ] as const;
  const STAFFING = ALL;
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        vanta="fog"
        title="Solutions built around outcomes."
        intro="Testsoft combines technology expertise, delivery capabilities, and specialized talent to help organizations solve complex technology challenges — and to scale the teams required to execute them."
      />

      {/* Stats */}
      <section className="relative z-10 py-8 sm:py-12">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line-blue border border-line-blue rounded-2xl overflow-hidden surface-card">
            {STAFFING_STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06} variant="zoom" className="bg-surface p-8 sm:p-10">
                <CountUp value={s.value} className={`display text-4xl sm:text-5xl ${PRISM_TEXT[i % 6]}`} />
                <p className="mt-3 text-sm text-graphite leading-relaxed">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services — Vanta topology animating densely behind the cards */}
      <section className="relative z-10 py-16 sm:py-24 overflow-hidden bg-paper">
        <VantaBg effect="topology" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-paper to-transparent" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 space-y-20 scene">
          {GROUPS.map((g) => {
            const rows = ALL.filter((x) => x.group === g.key);
            if (rows.length === 0) return null;
            return (
              <div key={g.key} id={g.key}>
                <div className="mb-10 scroll-mt-28">
                  <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-4">{g.title}</p></Reveal>
                  <Reveal delay={0.12}>
                    <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">
                      {g.key === "technology" ? (
                        <>Solve it with <span className="text-brand italic">technology.</span></>
                      ) : (
                        <>Staff it with the right <span className="text-brand italic">people.</span></>
                      )}
                    </h2>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <p className="mt-5 max-w-2xl text-graphite leading-relaxed">{g.blurb}</p>
                  </Reveal>
                </div>

                <div className="space-y-5">
                  {rows.map((s, i) => (
                    <Reveal key={s.id} delay={0.03} variant={g.key === "technology" ? "right" : "left"} duration={0.75}>
                      <TiltCard max={5}>
                        <div
                          id={s.id}
                          className="card-3d scroll-mt-28 group relative overflow-hidden grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 bg-surface/92 border border-line rounded-3xl p-8 sm:p-12 hover:border-brand/50"
                        >
                          <span aria-hidden className={`prism-wash pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full ${PRISM_BG[i % 6]} blur-[100px] transition-opacity duration-500 group-hover:opacity-40`} />
                          <div className="relative">
                            <div className={`prism-rule ${PRISM_BG[i % 6]} mb-6 transition-all duration-500 group-hover:w-28`} />
                            <h2 className="display text-3xl sm:text-5xl text-ink">
                              <Link href={`/us-staffing/${s.id}`} className="hover:text-brand transition-colors">{s.name}</Link>
                            </h2>
                            <p className="mt-3 text-accent-deep">{s.line}</p>
                            <ul className="mt-8 space-y-2">
                              {s.points.map((p) => (
                                <li key={p} className="flex gap-3 text-sm text-graphite">
                                  <span className={`${PRISM_TEXT[i % 6]} mt-0.5`}>—</span>
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                            <Link href={`/us-staffing/${s.id}`} className="mt-8 inline-flex items-center gap-2 mono-label text-accent-deep hover:text-brand transition-colors">
                              Explore {s.name} →
                            </Link>
                          </div>
                          <p className="relative text-lg sm:text-xl text-graphite leading-relaxed self-center">{s.body}</p>
                        </div>
                      </TiltCard>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA band */}
      <section className="relative z-10 py-16 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal>
            <div className="glass glow-brand rounded-3xl p-10 sm:p-16 text-center">
              <p className="mono-label text-accent-deep mb-4">Staffing enquiry</p>
              <h2 className="display text-4xl sm:text-6xl text-ink max-w-2xl mx-auto">
                Send us a req. Get a shortlist.
              </h2>
              <p className="mt-5 text-graphite max-w-xl mx-auto">
                Tell us the role, the stack, and the timeline — most first submittals land within 48 hours.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 bg-brand text-white px-7 py-3.5 rounded-full font-medium hover:bg-brand-deep transition-colors"
              >
                Start a staffing request →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="bg-surface">
      <CtaBanner
        eyebrow="Solutions"
        heading="Discuss your workforce requirements."
        body="Roles, skills, locations, engagement model and timeline — tell us what you need and we will map it to the right model."
        cta="Discuss Workforce Requirements"
      />

        <PartnerStrip heading="Trusted by" title="Staffing partners across enterprise and the public sector." variant="grid" />
      </div>
    </>
  );
}
