import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import VantaBg from "@/components/VantaBg";
import PartnerStrip from "@/components/PartnerStrip";
import { STAFFING_STATS, PRISM_TEXT } from "@/lib/data";
import { getStaffing } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Testsoft staff augmentation — contract staffing, direct hire, SOW delivery pods, MSP/VMS program management, and compliant payrolling across all 50 states.",
};

export default async function UsStaffingPage() {
  const STAFFING = await getStaffing();
  return (
    <>
      <PageHeader
        eyebrow="Services"
        vanta="fog"
        art="orbit"
        title="Talent, on demand."
        intro="A certified Minority Business Enterprise placing IT and enterprise-application talent across the US — contract, direct hire, and outcome-based pods, with compliance handled end to end."
      />

      {/* Stats */}
      <section className="relative z-10 py-8 sm:py-12">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line-blue border border-line-blue rounded-2xl overflow-hidden surface-card">
            {STAFFING_STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06} className="bg-surface p-8 sm:p-10">
                <p className={`display text-4xl sm:text-5xl ${PRISM_TEXT[i % 6]}`}>{s.value}</p>
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
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 space-y-5 scene">
          {STAFFING.map((s) => (
            <Reveal key={s.id} delay={0.03}>
              <TiltCard max={5}>
                <div
                  id={s.id}
                  className="card-3d scroll-mt-28 group grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 bg-surface/92 border border-line rounded-3xl p-8 sm:p-12"
                >
                  <div>
                    <div className="h-px w-16 bg-brand/50 mb-6" />
                    <h2 className="display text-3xl sm:text-5xl text-ink">{s.name}</h2>
                    <p className="mt-3 text-accent-deep">{s.line}</p>
                    <ul className="mt-8 space-y-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex gap-3 text-sm text-graphite">
                          <span className="text-brand mt-0.5">—</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-lg sm:text-xl text-graphite leading-relaxed self-center">{s.body}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
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
        <PartnerStrip heading="Trusted by" title="Staffing partners across enterprise and the public sector." variant="grid" />
      </div>
    </>
  );
}
