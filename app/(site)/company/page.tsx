import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import PartnerStrip from "@/components/PartnerStrip";
import Leadership from "@/components/Leadership";
import ScrollStory from "@/components/ScrollStory";
import VantaBg from "@/components/VantaBg";
import { LOCATIONS, METRICS, PRISM_TEXT } from "@/lib/data";
import { getAwards } from "@/lib/site";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

const WHY = [
  { kicker: "Ownership", title: "Consultants, not resources", body: "Our people are employees with a stake in outcomes — funded certifications, senior mentorship, and low turnover so the team that starts your project finishes it." },
  { kicker: "Regulated-ready", title: "Built for high-stakes operations", body: "Utilities, manufacturing, public sector, higher education — auditable delivery, security controls, and compliance baked into how we work." },
  { kicker: "Global reach", title: "Onshore judgement, offshore scale", body: "US-based engagement leadership with nearshore Mexico and offshore India pods — the right blend of cost, coverage, and accountability." },
  { kicker: "Proof", title: "An Inc. 500 track record", body: "Recognized for growth and delivery across a decade — and a certified Minority Business Enterprise your procurement team can count toward diversity spend." },
];

export const metadata: Metadata = {
  title: "Company",
  description: "About Testsoft Technologies — leadership, awards, delivery centers, and corporate responsibility.",
};


export default async function CompanyPage() {
  const AWARDS = await getAwards();
  return (
    <div className="relative">
      {/* Full-page topology, pinned to the viewport, theme-matched */}
      <VantaBg effect="topology" fixed />

      <div className="relative z-10">
      <PageHeader
        eyebrow="Company"
        title="People-centric by design."
        intro="Headquartered in Texas, Testsoft is an Inc. 500 provider of end-to-end enterprise application consulting — modernizing core business processes across CRM, ERP, and HCM for clients worldwide."
      />

      <section id="about" className="relative z-10 bg-surface/70 pt-16 sm:pt-24 pb-24 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            <Reveal>
              <p className="mono-label text-accent-deep mb-4">About us</p>
              <p className="text-2xl sm:text-3xl text-ink display leading-tight">
                We specialize in digital transformation across Salesforce, SAP, Oracle, Infor, and Workday.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="space-y-5 text-graphite leading-relaxed self-center">
              <p>Our certified consultants help clients modernize their core business processes — driving operational efficiency and strategic growth. As an employee-centric company, we engage, empower, and enrich the people who deliver that work.</p>
              <p>More than technology implementers, we act as strategic partners. Every deployed solution is rooted in our clients&apos; business objectives, built to create enduring partnerships rather than one-off projects.</p>
            </Reveal>
          </div>

          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-2xl overflow-hidden">
            {METRICS.map((m, i) => (
              <div key={m.value} className="bg-paper p-8">
                <p className={`display text-4xl sm:text-5xl ${PRISM_TEXT[i % 6]}`}>{m.value}</p>
                <p className="mt-2 text-xs text-graphite">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="leadership" className="relative z-10 bg-paper-tint/55 py-24 sm:py-32 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-16">
            <p className="mono-label text-accent-deep mb-4">Leadership</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">The people steering delivery.</h2>
          </Reveal>
          <Leadership />
        </div>
      </section>

      <section id="awards" className="relative z-10 bg-surface/70 py-24 sm:py-32 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-16">
            <p className="mono-label text-accent-deep mb-4">Awards & Recognition</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">A track record, recognized.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 scene" style={{ perspective: 1400 }}>
            {AWARDS.map((a, i) => (
              <Reveal key={i} delay={(i % 3) * 0.05}>
                <div className="card-3d group h-full relative bg-paper border border-line rounded-2xl p-6 overflow-hidden hover:border-brand/50">
                  <span className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full ${PRISM_BG[i % 6]} opacity-[0.12] blur-[70px] group-hover:opacity-25 transition-opacity duration-500`} />
                  <div className="relative flex items-start gap-4">
                    {a.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.image} alt="" className="h-14 w-14 object-contain rounded-lg bg-white p-1.5 ring-1 ring-black/5 shrink-0" />
                    ) : (
                      <span className={`display text-3xl ${PRISM_TEXT[i % 6]} shrink-0`}>{a.year}</span>
                    )}
                    <div>
                      {a.image && <span className={`mono-label ${PRISM_TEXT[i % 6]}`}>{a.year}</span>}
                      <p className="text-ink/90 text-[15px] leading-snug mt-1">{a.title}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-paper/55">        <ScrollStory eyebrow="Why Testsoft" heading="What the awards actually mean." items={WHY} />
      </div>

      <section id="delivery" className="relative z-10 bg-paper-tint/55 py-24 sm:py-32 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-16">
            <p className="mono-label text-accent-deep mb-4">Delivery Centers</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">One team, three time zones.</h2>
            <p className="mt-6 max-w-2xl text-graphite">Physical offices across the US, Mexico, and India — registered to serve the USA, Canada, UK, Spain, Mexico, Argentina, Brazil, Peru, and beyond.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {LOCATIONS.map((loc, i) => (
              <Reveal key={loc.region} delay={(i % 2) * 0.06}>
                <div className="h-full bg-surface border border-line rounded-2xl p-8">
                  <p className="mono-label text-accent-deep mb-3">{loc.role}</p>
                  <h3 className="display text-2xl text-ink">{loc.region}</h3>
                  <p className="mt-3 text-sm text-graphite leading-relaxed">{loc.address}</p>
                  <p className="mt-2 text-sm text-brand">{loc.tel}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="csr" className="relative z-10 bg-surface/70 py-24 sm:py-32 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <Reveal>
              <p className="mono-label text-accent-deep mb-4">Corporate Social Responsibility</p>
              <h2 className="display text-5xl sm:text-6xl text-ink">Atmiya USA</h2>
              <p className="mt-6 text-graphite leading-relaxed">To educate, enrich, empower, and elevate members of the community into a flourishing relationship of fraternity — inspiring mutual help and cooperation toward positive economic, social, and cultural growth.</p>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-brand hover:gap-3 transition-all">Get involved →</Link>
            </Reveal>
            <Reveal delay={0.1} className="grid sm:grid-cols-2 gap-4">
              {["FIRE — Investments","ASARA — Students, Training & Jobs","BEST — Entrepreneurship","Real Women Power","Immigration Support","Community Affairs"].map((p) => (
                <div key={p} className="bg-paper border border-line rounded-xl p-5 text-sm text-ink/80">{p}</div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <div className="bg-surface/70">
        <PartnerStrip heading="Clients & Partners" title="The organizations we build alongside." variant="grid" />
      </div>
      </div>
    </div>
  );
}
