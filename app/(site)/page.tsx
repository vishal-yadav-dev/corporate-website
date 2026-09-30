import Link from "next/link";
import Hero from "@/components/Hero";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import LinkPending from "@/components/LinkPending";
import PartnerStrip from "@/components/PartnerStrip";
import ScrollStory from "@/components/ScrollStory";
import { METRICS, INDUSTRIES, PRISM_TEXT } from "@/lib/data";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];
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

      {/* Practices. This was a pinned story that spent a screen of scrolling on
          each platform to say its name and one line. The same five now read
          left to right in a single band, and the page they lead to carries the
          detail. */}
      <section className="relative z-10 py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal delay={0.05}>
                <p className="mono-label text-accent-deep mb-4">Practices</p>
              </Reveal>
              <Reveal delay={0.12}>
                <h2 className="display text-4xl sm:text-6xl text-ink max-w-2xl">The platforms we live in.</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 max-w-xl text-graphite leading-relaxed">
                  Full-lifecycle delivery on the enterprise platforms your business runs on.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.24}>
              <Link
                href="/practices"
                className="group inline-flex items-center gap-2 mono-label text-accent-deep hover:text-brand transition-colors"
              >
                All practices
                <LinkPending />
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>

          {/* Five across on a wide screen; below that it becomes a rail the
              reader swipes, which keeps the cards legible instead of stacking
              five tall boxes on a phone. */}
          <div className="-mx-5 sm:-mx-8 lg:mx-0 overflow-x-auto lg:overflow-visible scrollbar-none">
            <div className="flex gap-4 px-5 sm:px-8 lg:px-0 lg:grid lg:grid-cols-5">
              {PRACTICES.slice(0, 5).map((it, i) => (
                <Reveal key={it.id} delay={i * 0.06} className="w-[72vw] shrink-0 sm:w-[46vw] lg:w-auto">
                  <Link
                    href={`/practices/${it.id}`}
                    className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 hover:border-brand/50"
                  >
                    <span
                      aria-hidden
                      className={`prism-wash pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full ${PRISM_BG[i % 6]} blur-[70px] transition-opacity duration-500 group-hover:opacity-40`}
                    />
                    {it.logo ? (
                      <span className="relative inline-grid h-11 w-fit place-items-center rounded-lg bg-white px-3 ring-1 ring-black/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={it.logo} alt="" className="h-6 w-auto max-w-[104px] object-contain" />
                      </span>
                    ) : (
                      <span className={`prism-rule relative ${PRISM_BG[i % 6]}`} />
                    )}
                    <h3 className="relative display text-2xl text-ink mt-5 group-hover:text-brand transition-colors">
                      {it.name}
                    </h3>
                    <p className="relative mt-2 text-sm text-accent-deep">{it.tag}</p>
                    <span className="relative mt-5 inline-flex items-center gap-2 mono-label text-graphite group-hover:text-brand transition-colors">
                      Explore
                      <LinkPending />
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries — brand tint band */}
      {/* SLED spotlight — the segment the business most wants to win work in */}
      <section className="relative z-10 bg-paper-tint/55 py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] border border-line-blue/60 bg-surface p-8 sm:p-14">
              <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-[110px]" />
              <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
                <div>
                  <Reveal delay={0.05}>
                    <p className="mono-label text-accent-deep mb-4">State, Local &amp; Education</p>
                  </Reveal>
                  <Reveal delay={0.12}>
                    <h2 className="display text-4xl sm:text-6xl text-ink">Technology for the public sector.</h2>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <p className="mt-6 max-w-xl text-graphite leading-relaxed">
                      We help government agencies, public institutions, and education organizations modernize
                      technology, strengthen digital capabilities, and access specialized technology talent —
                      with the auditability and procurement discipline public work demands.
                    </p>
                  </Reveal>
                  <div className="mt-7 flex flex-wrap gap-2 max-w-xl">
                    {["Digital Transformation", "Enterprise Applications", "Cloud & Infrastructure", "Data & Analytics", "Cybersecurity & QE", "Technology Workforce"].map((c, ci) => (
                      <Reveal key={c} delay={0.26 + ci * 0.05}>
                        <span className="mono-label text-graphite border border-line-blue rounded-full px-3 py-1.5 inline-block hover:border-brand/50 hover:text-brand transition-colors">{c}</span>
                      </Reveal>
                    ))}
                  </div>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <Link href="/industries#sled" className="group inline-flex items-center gap-2 bg-brand text-white px-6 py-3.5 rounded-full font-medium hover:bg-brand-deep transition-colors">
                      Explore SLED
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                    <Link href="/contact" className="inline-flex items-center gap-2 border border-line-blue text-ink px-6 py-3.5 rounded-full font-medium hover:border-brand hover:text-brand transition-colors">
                      Talk to an Expert
                    </Link>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-px bg-line-blue border border-line-blue rounded-2xl overflow-hidden">
                  {[
                    { k: "MBE", v: "Certified Minority Business Enterprise" },
                    { k: "50", v: "States with payroll and compliance coverage" },
                    { k: "6", v: "Industries with dedicated capability" },
                    { k: "13", v: "Technology practices to draw from" },
                  ].map((x, i) => (
                    <Reveal key={x.k} delay={0.55 + i * 0.08} className="bg-surface p-6">
                      <CountUp value={x.k} className={`display text-3xl sm:text-4xl ${PRISM_TEXT[i % 6]}`} />
                      <dd className="mt-2 text-xs text-graphite leading-relaxed">{x.v}</dd>
                    </Reveal>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Workforce solutions. This listed all twelve as cards, which cost four
          rows of scrolling to say something the two group names already say.
          It now sends the reader to the page that holds them. */}
      <section className="relative z-10 py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="mb-14">
            <Reveal delay={0.05}>
              <p className="mono-label text-accent-deep mb-4">Technology Workforce Solutions</p>
            </Reveal>
            <Reveal delay={0.12}>
              <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">The right people to execute it.</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-2xl text-graphite leading-relaxed">
                Great technology strategies require the right people to execute them. We provide flexible workforce
                solutions that help organizations access specialized technology talent when and where they need it.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                key: "technology",
                eyebrow: "Technology Solutions",
                title: "Solve it with technology.",
                body: "Transformation, modernisation, cloud, data and integration programmes, delivered end to end.",
                accent: 4,
              },
              {
                key: "workforce",
                eyebrow: "Workforce Solutions",
                title: "Staff it with the right people.",
                body: "Augmentation, contingent workforce, direct hire, SOW teams and managed delivery.",
                accent: 5,
              },
            ].map((g, i) => {
              const rows = SOLUTIONS.filter((s) => s.group === g.key);
              return (
                <Reveal key={g.key} delay={i * 0.08} variant={i ? "left" : "right"} duration={0.75}>
                  <Link
                    href="/us-staffing"
                    className="card-lift group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-11 hover:border-brand/50"
                  >
                    <span
                      aria-hidden
                      className={`prism-wash pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full ${PRISM_BG[g.accent]} blur-[90px] transition-opacity duration-500 group-hover:opacity-40`}
                    />
                    <span className={`relative mono-label ${PRISM_TEXT[g.accent]}`}>{g.eyebrow}</span>
                    <h3 className="relative display text-3xl sm:text-5xl text-ink mt-4 group-hover:text-brand transition-colors">
                      {g.title}
                    </h3>
                    <p className="relative mt-5 text-graphite leading-relaxed">{g.body}</p>

                    {/* the names themselves, as a list rather than as cards */}
                    <div className="relative mt-7 flex flex-wrap gap-2">
                      {rows.map((s) => (
                        <span
                          key={s.id}
                          className="mono-label text-graphite border border-line-blue rounded-full px-3 py-1.5 group-hover:border-brand/40 transition-colors"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>

                    <span className="relative mt-8 inline-flex items-center gap-2 mono-label text-accent-deep group-hover:text-brand transition-colors">
                      Explore {g.eyebrow}
                      <LinkPending />
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries. SLED already has its own spotlight above with its own
          "Explore SLED", so listing all five again as full rows repeated a
          section the reader had just passed. One band, every industry still one
          click away. */}
      <section className="relative z-10 bg-paper-tint py-20 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 lg:items-center">
            <Reveal>
              <p className="mono-label text-accent-deep mb-4">Industry Expertise</p>
              <h2 className="display text-4xl sm:text-6xl text-ink">
                Technology solutions built around your industry.
              </h2>
              <Link
                href="/industries"
                className="group mt-7 inline-flex items-center gap-2 mono-label text-accent-deep hover:text-brand transition-colors"
              >
                All industries
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>

            <Reveal delay={0.1} variant="left" duration={0.75}>
              <div className="grid sm:grid-cols-2 gap-3">
                {INDUSTRIES.map((ind, i) => (
                  <Link
                    key={ind.id}
                    href={`/industries/${ind.id}`}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-4 transition-colors hover:border-brand/50"
                  >
                    <span className="min-w-0">
                      <span className={`display block text-lg text-ink truncate group-hover:text-brand transition-colors`}>
                        {ind.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-graphite truncate">{ind.line}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-accent-deep">
                      <LinkPending />
                      <span
                        aria-hidden
                        className={`h-2 w-2 rounded-full ${PRISM_BG[i % 6]} transition-transform duration-300 group-hover:scale-150`}
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
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
