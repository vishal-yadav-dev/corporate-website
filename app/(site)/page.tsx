import Link from "next/link";
import Hero from "@/components/Hero";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import PartnerStrip from "@/components/PartnerStrip";
import ScrollStory from "@/components/ScrollStory";
import PlatformStory from "@/components/PlatformStory";
import { METRICS, INDUSTRIES, PRISM_TEXT } from "@/lib/data";
import { getBanners, getPractices, getStaffing } from "@/lib/site";

const DELIVERY = [
  { kicker: "Discover", title: "Discover", image: "/delivery/discover.jpg",
    body: "Current-state assessment, requirements, stakeholder alignment, and opportunity identification — so the work starts from the business problem, not a tool choice." },
  { kicker: "Design", title: "Design", image: "/delivery/build.jpg",
    body: "Architecture, solution blueprint, roadmap, governance, and delivery plan. We define the target state and the capabilities required to reach it." },
  { kicker: "Deliver", title: "Deliver", image: "/delivery/integrate.jpg",
    body: "Implementation, engineering, integration, testing, project management, and workforce support — building, configuring, and staffing the work with the right specialists." },
  { kicker: "Optimize", title: "Optimize", image: "/delivery/run.jpg",
    body: "Hypercare, support, managed services, performance improvement, and continuous enhancement that turn go-live into lasting adoption." },
];

/* ISR: the page is still delivered as static HTML, but regenerates at most once
   a minute so banner/practice edits made in /admin appear without a redeploy. */
export const revalidate = 60;

export default async function Home() {
  const [PRACTICES, BANNERS, SOLUTIONS] = await Promise.all([getPractices(), getBanners(), getStaffing()]);
  return (
    <>
      <Hero initialBanners={BANNERS} />

      {/* Metrics */}
      <section className="relative z-10 py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line-blue border border-line-blue rounded-2xl overflow-hidden surface-card">
            {METRICS.map((m, i) => (
              <Reveal key={m.value} delay={i * 0.06} className="bg-surface p-8 sm:p-10">
                <CountUp value={m.value} className={`display text-5xl sm:text-6xl ${PRISM_TEXT[i % 6]}`} />
                <p className="mt-3 text-sm text-graphite leading-relaxed">{m.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Practices — pinned prism, cards scroll over */}
      <PlatformStory items={PRACTICES.slice(0, 8)} />

      {/* Industries — brand tint band */}
      {/* Workforce solutions — the second half of the positioning, which the
          homepage previously never mentioned. */}
      <section className="relative z-10 py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-14">
            <p className="mono-label text-accent-deep mb-4">Technology Workforce Solutions</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">The right people to execute it.</h2>
            <p className="mt-6 max-w-2xl text-graphite leading-relaxed">
              Great technology strategies require the right people to execute them. We provide flexible workforce
              solutions that help organizations access specialized technology talent when and where they need it.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOLUTIONS.map((sol, i) => (
              <Reveal key={sol.id} delay={(i % 3) * 0.05}>
                <Link
                  href={`/us-staffing#${sol.id}`}
                  className="card-lift group flex h-full flex-col bg-surface border border-line rounded-2xl p-7 hover:border-brand/50"
                >
                  <span className={`mono-label ${PRISM_TEXT[i % 6]}`}>0{i + 1}</span>
                  <h3 className="display text-2xl text-ink mt-4 group-hover:text-brand transition-colors">{sol.name}</h3>
                  <p className="mt-2 text-sm text-accent-deep">{sol.line}</p>
                  <p className="mt-4 text-sm text-ink/70 leading-relaxed flex-1">{sol.body}</p>
                  <span className="mt-6 mono-label text-graphite group-hover:text-brand transition-colors">Explore →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-paper-tint py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-16">
            <p className="mono-label text-accent-deep mb-4">Industry Expertise</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">Technology solutions built around your industry.</h2>
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
        <ScrollStory eyebrow="How we deliver" heading="From strategy to execution." items={DELIVERY} />
      </div>

      {/* Clients & Partners */}
      <div className="bg-surface">
        <PartnerStrip title="Technology expertise across the enterprise." />
      </div>
    </>
  );
}
