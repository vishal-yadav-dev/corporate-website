import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import PartnerStrip from "@/components/PartnerStrip";
import CtaBanner from "@/components/CtaBanner";
import ScrollStory from "@/components/ScrollStory";
import VantaBg from "@/components/VantaBg";
import { getPractices } from "@/lib/site";

export const metadata: Metadata = {
  title: "Practices",
  description: "Salesforce, SAP, Oracle, Infor, Workday, MuleSoft and integration practices — full-lifecycle enterprise application delivery.",
};

/* The blueprint asks for technology grouped by category. Platforms carry a
   logo and earn a full-width feature card; engineering and integration
   practices read better as a capability grid. */
const PLATFORM_IDS = ["salesforce", "sap", "oracle", "workday", "infor"];
const ENGINEERING_IDS = ["application-development", "cloud-devops", "data-analytics", "ai-automation", "quality-engineering"];
const INTEGRATION_IDS = ["mulesoft", "api-integration", "enterprise-integration"];

const INTEGRATIONS = [
  {
    kicker: "Conversational AI",
    title: "Salesforce chatbots & Agentforce",
    body: "We design, build, and tune Einstein Bots and Agentforce agents on Service Cloud and Experience Cloud — grounded in your knowledge base, wired to real actions, and handed off cleanly to live agents.",
  },
  {
    kicker: "API-led",
    title: "MuleSoft application networks",
    body: "Anypoint-based System, Process, and Experience APIs that make legacy data reusable and keep ERP, CRM, and custom apps in sync in real time.",
  },
  {
    kicker: "iPaaS & events",
    title: "Event-driven integration",
    body: "Platform events, streaming, and iPaaS pipelines so mission-critical systems react to each other in seconds — not overnight batch windows.",
  },
  {
    kicker: "Data",
    title: "Master data & sync",
    body: "Bi-directional sync, de-duplication, and a single source of truth across CRM, ERP, and the data warehouse, with monitoring and reconciliation built in.",
  },
];

export default async function PracticesPage() {
  const ALL = await getPractices();
  const platforms = PLATFORM_IDS.map((id) => ALL.find((p) => p.id === id)).filter(Boolean) as typeof ALL;
  const engineering = ENGINEERING_IDS.map((id) => ALL.find((p) => p.id === id)).filter(Boolean) as typeof ALL;
  const integration = INTEGRATION_IDS.map((id) => ALL.find((p) => p.id === id)).filter(Boolean) as typeof ALL;
  const PRACTICES = platforms;
  return (
    <>
      <PageHeader
        eyebrow="Practices"
        vanta="globe"
        title="Enterprise platforms, mastered."
        intro="Our practices combine platform expertise, engineering capabilities, integration, and delivery discipline to solve complex technology problems."
      />

      {/* Practice listing — Vanta topology animating densely behind the cards */}
      <section className="relative z-10 overflow-hidden bg-paper">
        <VantaBg effect="topology" />
        {/* only fade the very top & bottom so the animation stays visible */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-paper to-transparent" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 py-20 sm:py-28">
          <Reveal className="mb-14">
            <p className="mono-label text-accent-deep mb-4">Enterprise Platforms</p>
            <h2 className="display text-4xl sm:text-6xl text-ink max-w-2xl">The platforms your business runs on.</h2>
          </Reveal>

          <div className="space-y-6 scene" style={{ perspective: 1400 }}>
            {PRACTICES.map((p, i) => (
              <Reveal key={p.id} delay={0.03}>
                <div
                  id={p.id}
                  className={`card-3d scroll-mt-28 group relative grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-16 bg-surface/92 border border-line rounded-[28px] p-8 sm:p-12 overflow-hidden hover:border-brand/60 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-brand/10 blur-[110px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="h-px w-14 bg-brand/50 mb-6" />
                    {p.logo && (
                      <div className="inline-grid place-items-center rounded-xl bg-white px-4 h-12 sm:h-14 mb-6 ring-1 ring-black/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.logo} alt={`${p.name} logo`} className="h-7 sm:h-8 w-auto max-w-[150px] object-contain" />
                      </div>
                    )}
                    <h3 className="display text-4xl sm:text-6xl text-ink">{p.name}</h3>
                    <p className="mt-3 text-accent-deep">{p.tag}</p>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <span key={s} className="mono-label text-graphite border border-line-blue rounded-full px-3 py-1.5 group-hover:border-brand/40 transition-colors">{s}</span>
                      ))}
                    </div>
                  </div>
                  <p className="relative text-lg sm:text-xl text-ink/75 leading-relaxed self-center">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Digital engineering + integration as capability grids */}
      <section className="relative z-10 bg-surface/70 py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-12">
            <p className="mono-label text-accent-deep mb-4">Digital Engineering</p>
            <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">Engineering that moves business forward.</h2>
            <p className="mt-6 max-w-2xl text-graphite leading-relaxed">
              Engineering expertise, modern technologies, and industry understanding applied to building, modernizing, and optimizing digital environments.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {engineering.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.05}>
                <article id={p.id} className="card-lift scroll-mt-28 group h-full bg-paper border border-line rounded-2xl p-7 hover:border-brand/50">
                  <div className="h-px w-10 bg-brand/50 mb-5" />
                  <h3 className="display text-2xl text-ink group-hover:text-brand transition-colors">{p.name}</h3>
                  <p className="mt-1.5 mono-label text-accent-deep">{p.tag}</p>
                  <p className="mt-4 text-sm text-ink/75 leading-relaxed">{p.body}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.stack.map((t) => (
                      <span key={t} className="mono-label text-graphite border border-line-blue rounded-full px-2.5 py-1">{t}</span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20 mb-12">
            <p className="mono-label text-accent-deep mb-4">Integration</p>
            <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">Connect applications, data, and experiences.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {integration.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.05}>
                <article id={p.id} className="card-lift scroll-mt-28 group h-full bg-paper border border-line rounded-2xl p-7 hover:border-brand/50">
                  <div className="h-px w-10 bg-brand/50 mb-5" />
                  <h3 className="display text-2xl text-ink group-hover:text-brand transition-colors">{p.name}</h3>
                  <p className="mt-1.5 mono-label text-accent-deep">{p.tag}</p>
                  <p className="mt-4 text-sm text-ink/75 leading-relaxed">{p.body}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.stack.map((t) => (
                      <span key={t} className="mono-label text-graphite border border-line-blue rounded-full px-2.5 py-1">{t}</span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-paper">
        <ScrollStory
          eyebrow="Integration & AI"
          heading="We connect the platforms — and give them a voice."
          items={INTEGRATIONS}
        />
      </div>

      <CtaBanner
        eyebrow="Practices"
        heading="Talk to a practice expert."
        body="Tell us which platform or capability you are working on, and we will bring the people who have done it before."
      />

      <div className="bg-surface">
        <PartnerStrip heading="Platform partners & clients" title="Certified across the platforms we deliver." variant="grid" />
      </div>
    </>
  );
}
