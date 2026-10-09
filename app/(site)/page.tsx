import Link from "next/link";
import Hero from "@/components/Hero";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import LinkPending from "@/components/LinkPending";
import PartnerStrip from "@/components/PartnerStrip";
import ScrollStory from "@/components/ScrollStory";
import { METRICS, INDUSTRIES, PRISM_TEXT, PRISM_VAR } from "@/lib/data";
import { formatDate, readMinutes } from "@/lib/blog";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];
import { getBanners, getPractices, getStaffing, getCopy, getBlogPosts } from "@/lib/site";
import { COPY_DEFAULTS } from "@/lib/copy";

const DELIVERY = [
  { kicker: "Discover", title: "Discover", image: "/delivery/discover.jpg",
    body: "Current-state assessment, requirements, stakeholder alignment, and opportunity identification, so the work starts from the business problem, not a tool choice." },
  { kicker: "Design", title: "Design", image: "/delivery/build.jpg",
    body: "Architecture, solution blueprint, roadmap, governance, and delivery plan. We define the target state and the capabilities required to reach it." },
  { kicker: "Deliver", title: "Deliver", image: "/delivery/integrate.jpg",
    body: "Implementation, engineering, integration, testing, project management, and workforce support, building, configuring, and staffing the work with the right specialists." },
  { kicker: "Optimize", title: "Optimize", image: "/delivery/run.jpg",
    body: "Hypercare, support, managed services, performance improvement, and continuous enhancement that turn go-live into lasting adoption." },
];

/* ISR: the page is still delivered as static HTML, but regenerates at most once
   a minute so banner/practice edits made in /admin appear without a redeploy. */
export const revalidate = 60;

export default async function Home() {
  const [PRACTICES, BANNERS, SOLUTIONS, copy, posts] = await Promise.all([
    getPractices(), getBanners(), getStaffing(), getCopy(COPY_DEFAULTS), getBlogPosts(),
  ]);
  return (
    <>
      <Hero initialBanners={BANNERS} />

      {/* Metrics */}
      <section className="relative z-10 py-10 sm:py-12" style={{ "--page-accent": PRISM_VAR[3] } as React.CSSProperties}>
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line-blue border border-line-blue rounded-2xl overflow-hidden surface-card">
            {METRICS.map((m, i) => (
              /* The figure is sized off its own cell, not the viewport: "Inc.500"
                 is seven characters in a half-width cell on a phone, and at a
                 fixed size it ran past the edge and was clipped by the card. */
              <Reveal key={m.label} delay={i * 0.06} className="@container bg-surface p-5 sm:p-10">
                <CountUp value={m.value} className={`display text-[min(3.75rem,22cqw)] ${PRISM_TEXT[i % 6]}`} />
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
      <section className="relative z-10 py-10 sm:py-12" style={{ "--page-accent": PRISM_VAR[1] } as React.CSSProperties}>
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal delay={0.05}>
                <p className="mono-label label-accent mb-4">{copy["home.practices.eyebrow"]}</p>
              </Reveal>
              <Reveal delay={0.12}>
                <h2 className="display text-4xl sm:text-6xl text-ink max-w-2xl">{copy["home.practices.title"]}</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 max-w-xl text-graphite leading-relaxed">
                  {copy["home.practices.intro"]}
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.24}>
              <Link
                href="/practices"
                className="group inline-flex items-center gap-2 mono-label label-accent hover:text-brand transition-colors"
              >
                {copy["home.practices.cta"]}
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
                  <Link href={`/practices/${it.id}`} className="flip group block h-full">
                    <div className="flip-inner h-full min-h-[14.5rem]">
                      {/* front */}
                      <div className="flip-face card-lift overflow-hidden rounded-2xl border border-line bg-surface p-6">
                        <span
                          aria-hidden
                          className={`prism-wash pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full ${PRISM_BG[i % 6]} blur-[70px]`}
                        />
                        {it.logo ? (
                          <span className="relative inline-grid h-11 w-fit place-items-center rounded-lg bg-white px-3 ring-1 ring-black/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={it.logo} alt="" className="h-6 w-auto max-w-[6.5rem] object-contain" />
                          </span>
                        ) : (
                          <span className={`prism-rule relative ${PRISM_BG[i % 6]}`} />
                        )}
                        <h3 className="relative display text-2xl text-ink mt-5">{it.name}</h3>
                        <p className="relative mt-2 text-sm label-accent">{it.tag}</p>
                      </div>

                      {/* back */}
                      <div className={`flip-face flip-back overflow-hidden rounded-2xl border border-brand/50 bg-surface p-6 flex flex-col`}>
                        <span
                          aria-hidden
                          className={`prism-wash-lg pointer-events-none absolute -left-16 -bottom-16 h-44 w-44 rounded-full ${PRISM_BG[i % 6]} blur-[70px]`}
                        />
                        <p className="relative mono-label label-accent">{it.name}</p>
                        {/* three lines at this width; the rest is on the page it opens */}
                        <p className="relative mt-3 text-sm text-ink/80 leading-relaxed line-clamp-4">{it.body}</p>
                        <span className="relative mt-auto pt-4 inline-flex items-center gap-2 mono-label text-brand">
                          Explore
                          <LinkPending />
                          <span aria-hidden>→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries — brand tint band */}
      {/* SLED spotlight — the segment the business most wants to win work in */}
      <section className="relative z-10 bg-paper-tint/55 py-10 sm:py-12" style={{ "--page-accent": PRISM_VAR[4] } as React.CSSProperties}>
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line-blue/60 bg-surface p-8 sm:p-14">
              {/* The footage is the card's own background, bled to all four
                  edges and dissolved into the surface — it has no frame, no
                  border and no corners of its own, so it reads as part of the
                  panel rather than as a video dropped into it. */}
              <video
                className="media-footage pointer-events-none absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                aria-hidden
              >
                <source src="/videos/sled.mp4" type="video/mp4" />
              </video>
              {/* Two passes: one along the card so the copy side is solid and the
                  footage survives on the right, one down it so the top edge is
                  never a hard cut. */}
              <span aria-hidden className="veil-x pointer-events-none absolute inset-0" />
              <span aria-hidden className="veil-y pointer-events-none absolute inset-0" />
              <span aria-hidden className="prism-wash pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent blur-[110px]" />
              <div className="relative">
                <div className="max-w-2xl">
                  <Reveal delay={0.05}>
                    <p className="mono-label label-accent mb-4">{copy["home.sled.eyebrow"]}</p>
                  </Reveal>
                  <Reveal delay={0.12}>
                    <h2 className="display text-4xl sm:text-6xl text-ink">{copy["home.sled.title"]}</h2>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <p className="mt-6 max-w-xl text-graphite leading-relaxed">
                    {copy["home.sled.body"]}
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
                    <Link href="/contact#form" className="inline-flex items-center gap-2 border border-line-blue text-ink px-6 py-3.5 rounded-full font-medium hover:border-brand hover:text-brand transition-colors">
                      Talk to an Expert
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Workforce solutions. This listed all twelve as cards, which cost four
          rows of scrolling to say something the two group names already say.
          It now sends the reader to the page that holds them. */}
      <section className="relative z-10 py-10 sm:py-12" style={{ "--page-accent": PRISM_VAR[2] } as React.CSSProperties}>
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <div className="mb-8">
            <Reveal delay={0.05}>
              <p className="mono-label label-accent mb-4">{copy["home.workforce.eyebrow"]}</p>
            </Reveal>
            <Reveal delay={0.12}>
              <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">{copy["home.workforce.title"]}</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-2xl text-graphite leading-relaxed">
                    {copy["home.workforce.body"]}
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
                    href="/solutions"
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

                    <span className="relative mt-8 inline-flex items-center gap-2 mono-label label-accent group-hover:text-brand transition-colors">
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
      <section className="relative z-10 bg-paper-tint py-10 sm:py-12" style={{ "--page-accent": PRISM_VAR[5] } as React.CSSProperties}>
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 lg:items-center">
            <Reveal>
              <p className="mono-label label-accent mb-4">{copy["home.industries.eyebrow"]}</p>
              <h2 className="display text-4xl sm:text-6xl text-ink">
                {copy["home.industries.title"]}
              </h2>
              <Link
                href="/industries"
                className="group mt-7 inline-flex items-center gap-2 mono-label label-accent hover:text-brand transition-colors"
              >
                {copy["home.industries.cta"]}
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
                    <span className="flex shrink-0 items-center gap-2 label-accent">
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
      <div className="bg-paper" style={{ "--page-accent": PRISM_VAR[0] } as React.CSSProperties}>
        <ScrollStory eyebrow={copy["home.delivery.eyebrow"]} heading={copy["home.delivery.title"]} items={DELIVERY} />
      </div>

      {/* Blogs, between the delivery narrative and the logo wall. */}
      <section className="relative z-10 bg-surface py-14 sm:py-18" style={{ "--page-accent": PRISM_VAR[2] } as React.CSSProperties}>
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="max-w-3xl mb-10">
            <p className="mono-label label-accent mb-4">Blogs</p>
            <h2 className="display text-4xl sm:text-6xl text-ink leading-[1.05]">
              Ideas shaping technology, business, and the{" "}
              <span className="italic" style={{ color: "var(--page-accent)" }}>future of work.</span>
            </h2>
            <p className="mt-5 text-graphite leading-relaxed">
              A place for Testsoft&apos;s perspectives on the technologies, industries, and trends shaping organizations.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {posts.slice(0, 3).map((a, i) => (
              <Reveal key={a.title} delay={i * 0.07} variant="rise" duration={0.7}>
                <Link
                  href={`/blog/${a.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.375rem] border border-line bg-paper transition-all duration-500 hover:-translate-y-1 hover:border-[var(--card-accent)]/50 hover:shadow-card"
                  style={{ "--card-accent": PRISM_VAR[(i * 2 + 1) % 6] } as React.CSSProperties}
                >
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.image}
                      alt={a.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="media-footage block aspect-[16/10] w-full object-cover transition-transform duration-[1.1s] group-hover:scale-[1.07]"
                      style={{ objectPosition: a.imagePos }}
                    />
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1.5 mono-label text-white ${PRISM_BG[(i * 2 + 1) % 6]}`}
                    >
                      {a.tag}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="display text-xl sm:text-2xl text-ink leading-tight transition-colors group-hover:text-[var(--card-accent)]">
                      {a.title}
                    </h3>
                    <p className="mt-3 text-sm text-graphite leading-relaxed">{a.excerpt}</p>
                    {/* the line a reader scans to decide whether to start */}
                    <p className="mt-5 mono-label text-graphite/80">
                      <time dateTime={a.date}>{formatDate(a.date)}</time> · {readMinutes(a)} min read
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 mono-label" style={{ color: "var(--card-accent)" }}>
                      Read More
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Below the cards, not beside the heading: following it is what you
              do after reading these three, not before. */}
          <Reveal delay={0.1}>
            <div className="mt-10 flex justify-end">
              <Link href="/blog" className="group mono-label label-accent inline-flex items-center gap-2 hover:text-brand transition-colors">
                Explore all blogs
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Clients & Partners */}
      <div className="bg-surface">
        <PartnerStrip title="Technology expertise across the enterprise." />
      </div>
    </>
  );
}
