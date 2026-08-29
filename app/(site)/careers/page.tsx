import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import JobBoard from "@/components/JobBoard";
import PartnerStrip from "@/components/PartnerStrip";
import { BENEFITS, PRISM_TEXT } from "@/lib/data";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

export const metadata: Metadata = {
  title: "Careers",
  description: "Build enterprise software that matters. Explore open roles across Salesforce, SAP, Oracle, Infor, Workday, and MuleSoft.",
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        vanta="waves"
        art="helix"
        title="Grow with the work."
        intro="We treat consultants as partners, not resources. You learn on real transformations, backed by funded certifications, senior mentorship, and delivery centers spanning three countries."
      />
      <section id="why" className="relative z-10 bg-surface pb-24 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            <Reveal>
              <p className="mono-label text-accent-deep mb-4">Why join us</p>
              <p className="text-2xl sm:text-3xl display text-ink leading-tight">Your skill set should stay ahead of the platform. Here, it does.</p>
            </Reveal>
            <Reveal delay={0.1} className="space-y-5 text-graphite leading-relaxed self-center">
              <p>We view our consultants as our primary asset, and we invest accordingly — continuous professional development, certifications, and mentorship built into how we work.</p>
              <p>Take ownership early, work across global delivery centers, and evolve into a partner in the company&apos;s journey.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="benefits" className="relative z-10 bg-paper-tint py-24 sm:py-32 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-16">
            <p className="mono-label text-accent-deep mb-4">Benefits</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">What you get in return.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5 scene" style={{ perspective: 1400 }}>
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={(i % 2) * 0.06}>
                <div className="card-3d group h-full relative bg-surface border border-line rounded-2xl p-8 overflow-hidden hover:border-brand/50">
                  <span
                    className={`pointer-events-none absolute -left-16 -bottom-16 h-52 w-52 rounded-full ${PRISM_BG[i % 6]} opacity-[0.10] blur-[80px] group-hover:opacity-20 transition-opacity duration-500`}
                  />
                  <span className={`relative mono-label ${PRISM_TEXT[i % 6]}`}>Benefit</span>
                  <h3 className="relative display text-2xl mt-5 text-ink">{b.title}</h3>
                  <p className="relative mt-3 text-graphite leading-relaxed">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="jobs" className="relative z-10 bg-surface py-24 sm:py-32 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-12">
            <p className="mono-label text-accent-deep mb-4">Open roles</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">Find your seat.</h2>
          </Reveal>
          <JobBoard />
        </div>
      </section>

      <div className="bg-paper-tint">
        <PartnerStrip heading="Where you'll work" title="On real transformations, for names you know." variant="grid" />
      </div>
    </>
  );
}
