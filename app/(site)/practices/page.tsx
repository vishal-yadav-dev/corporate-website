import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import PartnerStrip from "@/components/PartnerStrip";
import ScrollStory from "@/components/ScrollStory";
import VantaBg from "@/components/VantaBg";
import { getPractices } from "@/lib/site";

export const metadata: Metadata = {
  title: "Practices",
  description: "Salesforce, SAP, Oracle, Infor, Workday, MuleSoft and integration practices — full-lifecycle enterprise application delivery.",
};

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
  const PRACTICES = await getPractices();
  return (
    <>
      <PageHeader
        eyebrow="Practices"
        vanta="globe"
        title="ERP. CRM. HCM."
        intro="Full-lifecycle implementation, optimization, and support of world-class enterprise platforms — delivered by certified consultants across manufacturing, utilities, higher education, and the public sector."
      />

      {/* Practice listing — Vanta topology animating densely behind the cards */}
      <section className="relative z-10 overflow-hidden bg-paper">
        <VantaBg effect="topology" />
        {/* only fade the very top & bottom so the animation stays visible */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-paper to-transparent" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 py-20 sm:py-28">
          <Reveal className="mb-14">
            <p className="mono-label text-accent-deep mb-4">Our practices</p>
            <h2 className="display text-4xl sm:text-6xl text-ink max-w-2xl">One certified team per platform.</h2>
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

      <div className="bg-paper">
        <ScrollStory
          eyebrow="Integration & AI"
          heading="We connect the platforms — and give them a voice."
          items={INTEGRATIONS}
        />
      </div>

      <div className="bg-surface">
        <PartnerStrip heading="Platform partners & clients" title="Certified across the platforms we deliver." variant="grid" />
      </div>
    </>
  );
}
