import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import SectionBackdrop from "@/components/SectionBackdrop";
import JobBoard from "@/components/JobBoard";
import ResumeDrop from "@/components/ResumeDrop";
import PartnerStrip from "@/components/PartnerStrip";
import { BENEFITS, PRISM_TEXT } from "@/lib/data";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

/* ISR: rendered once and reused for a minute, so a click is not waiting
   on a database round trip. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Careers",
  description: "Build enterprise software that matters. Explore open roles across Salesforce, SAP, Oracle, Infor, Workday, and MuleSoft.",
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        flow
        title="Build what comes next."
        intro="Join a team working across technology, digital transformation, enterprise solutions, and workforce delivery, with clients who bring real, complex problems."
      />
      <section id="why" className="relative z-10 bg-surface pt-12 sm:pt-16 pb-16 scroll-mt-14">
        <SectionBackdrop variant="quiet" />
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20 lg:items-center">
            <div>
              <Reveal variant="right" duration={0.75}>
                <p className="mono-label text-accent-deep mb-4">Why join us</p>
                <p className="text-2xl sm:text-3xl display text-ink leading-tight">Your skill set should stay ahead of the platform. Here, it does.</p>
              </Reveal>
              <Reveal delay={0.1} variant="right" duration={0.75} className="mt-7 space-y-5 text-graphite leading-relaxed">
                <p>We view our consultants as our primary asset, and we invest accordingly: continuous professional development, certifications, and mentorship built into how we work.</p>
                <p>Take ownership early, work across global delivery centers, and evolve into a partner in the company&apos;s journey.</p>
              </Reveal>
            </div>

            {/* Two frames rather than one: a single photo in a rounded box is the
                stock-library look. Offset and overlapped, with the pair drifting
                at different rates, it reads as a composition. */}
            <Reveal delay={0.08} variant="left" duration={0.85}>
              <div className="relative pb-16 pl-10 sm:pb-20 sm:pl-16">
                <span
                  aria-hidden
                  className="anim-drift pointer-events-none absolute -right-8 -top-10 h-56 w-56 rounded-full bg-brand opacity-[0.16] blur-[90px]"
                />
                <figure className="group relative overflow-hidden rounded-[1.625rem] border border-line shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/company/people-centered.jpg"
                    alt="Two colleagues working through a problem at a laptop"
                    loading="lazy"
                    decoding="async"
                    className="media-footage anim-drift block aspect-[4/3] w-full scale-[1.06] object-cover transition-transform duration-[1.2s] group-hover:scale-[1.12]"
                  />
                </figure>
                <figure className="group absolute bottom-0 left-0 w-[46%] overflow-hidden rounded-[1.375rem] border border-line shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/delivery/build.jpg"
                    alt="An engineer working at a multi-screen desk"
                    loading="lazy"
                    decoding="async"
                    className="media-footage anim-float block aspect-[4/3] w-full scale-[1.08] object-cover transition-transform duration-[1.2s] group-hover:scale-[1.14]"
                  />
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-prism-blue to-transparent" />
                </figure>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="benefits" className="relative z-10 bg-paper-tint py-16 sm:py-20 scroll-mt-14">
        <SectionBackdrop from="bg-prism-blue" to="bg-prism-violet" />
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-10">
            <p className="mono-label text-accent-deep mb-4">Benefits</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">Life at Testsoft.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5 scene" style={{ perspective: 1400 }}>
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={(i % 2) * 0.06} variant="tilt" duration={0.7}>
                <div className="card-3d group h-full relative bg-surface border border-line rounded-2xl p-8 overflow-hidden hover:border-brand/50">
                  <span
                    className={`pointer-events-none absolute -left-16 -bottom-16 h-52 w-52 rounded-full ${PRISM_BG[i % 6]} prism-wash blur-[80px] group-hover:opacity-30 transition-opacity duration-500`}
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

      {/* Footage band: the page talks about working here, so it shows it. */}
      <section className="relative z-10 bg-surface pt-16 sm:pt-20">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal variant="rise" duration={0.8}>
            <figure className="relative overflow-hidden rounded-[1.75rem] border border-line">
              <video
                className="media-footage block w-full h-[clamp(13.75rem,30vw,25rem)] object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                aria-label="A team working through a problem together"
              >
                <source src="/videos/collaboration.mp4" type="video/mp4" />
              </video>
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-surface/35 to-transparent" />
              <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-brand to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-7 sm:p-12">
                <p className="display text-2xl sm:text-4xl text-ink max-w-2xl leading-[1.1]">
                  Ownership early, and people around you who have done it before.
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section id="jobs" className="relative z-10 bg-surface py-16 sm:py-20 scroll-mt-14">
        <SectionBackdrop variant="quiet" />
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9">
            <p className="mono-label text-accent-deep mb-4">Open roles</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">Find your next opportunity.</h2>
          </Reveal>
          <JobBoard />

          <Reveal className="mt-14" variant="rise" duration={0.75}>
            <div id="open-application" className="scroll-mt-16">
              <ResumeDrop />
            </div>
          </Reveal>
        </div>
      </section>

      <div className="bg-paper-tint">
        <PartnerStrip heading="Where you'll work" title="On real transformations, for names you know." />
      </div>
      <CtaBanner
        eyebrow="Careers"
        heading="Build what’s next with us."
        body="Technology, recruiting, delivery, operations. See the roles that are open, or send a resume and we will keep you in mind."
        cta="View Open Positions"
        href="/careers#jobs"
      />
      <div className="hidden">
      </div>
    </>
  );
}
