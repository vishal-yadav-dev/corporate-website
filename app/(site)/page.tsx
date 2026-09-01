import Link from "next/link";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import PartnerStrip from "@/components/PartnerStrip";
import ScrollStory from "@/components/ScrollStory";
import PlatformStory from "@/components/PlatformStory";
import { METRICS, INDUSTRIES, PRISM_TEXT } from "@/lib/data";
import { getBanners, getPractices } from "@/lib/site";

const DELIVERY = [
  { kicker: "Discover", title: "Discover & architect", body: "We map your processes, data, and constraints, then design the target architecture — no build starts without a blueprint everyone signs off on." },
  { kicker: "Build", title: "Build & configure", body: "Certified consultants configure and extend the platform in tight iterations, with code review, automated tests, and demos every sprint." },
  { kicker: "Connect", title: "Integrate", body: "API-led connectivity ties the new platform to your ERP, CRM, and bespoke systems so data moves in real time — not overnight batches." },
  { kicker: "Run", title: "Adopt & run", body: "Hypercare, enablement, and managed services turn go-live into lasting adoption, with SLAs and a roadmap for what's next." },
];

export default async function Home() {
  const [PRACTICES, BANNERS] = await Promise.all([getPractices(), getBanners()]);
  return (
    <>
      <Hero initialBanners={BANNERS} />

      {/* Metrics */}
      <section className="relative z-10 py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line-blue border border-line-blue rounded-2xl overflow-hidden surface-card">
            {METRICS.map((m, i) => (
              <Reveal key={m.value} delay={i * 0.06} className="bg-surface p-8 sm:p-10">
                <p className={`display text-5xl sm:text-6xl ${PRISM_TEXT[i % 6]}`}>{m.value}</p>
                <p className="mt-3 text-sm text-graphite leading-relaxed">{m.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Practices — pinned prism, cards scroll over */}
      <PlatformStory items={PRACTICES.slice(0, 8)} />

      {/* Industries — brand tint band */}
      <section className="relative z-10 bg-paper-tint py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-16">
            <p className="mono-label text-accent-deep mb-4">Industries</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">Built for regulated, high-volume operations.</h2>
          </Reveal>

          <div className="space-y-px bg-line-blue border border-line-blue rounded-2xl overflow-hidden">
            {INDUSTRIES.map((ind, i) => (
              <Reveal key={ind.id} delay={i * 0.04}>
                <Link href={`/industries#${ind.id}`} className="group grid md:grid-cols-[auto_1fr_auto] gap-4 md:gap-10 md:items-center bg-surface hover:bg-paper px-6 sm:px-10 py-8 transition-colors">
                  <span className="mono-label text-graphite/70">0{i + 1}</span>
                  <div>
                    <h3 className="display text-3xl sm:text-4xl text-ink group-hover:text-brand transition-colors">{ind.name}</h3>
                    <p className="text-graphite mt-1">{ind.line}</p>
                  </div>
                  <span className="hidden md:block text-brand/30 group-hover:text-brand group-hover:translate-x-2 transition-all text-2xl">→</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How we deliver — sticky scroll narrative */}
      <div className="bg-paper">
        <ScrollStory eyebrow="How we deliver" heading="Blueprint first. Adoption last." items={DELIVERY} />
      </div>

      {/* Clients & Partners */}
      <div className="bg-surface">
        <PartnerStrip title="Trusted across enterprise, education, and the public sector." />
      </div>
    </>
  );
}
