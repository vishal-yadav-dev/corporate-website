import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionBackdrop from "@/components/SectionBackdrop";
import ConstellationField from "@/components/ConstellationField";
import DataFlow from "@/components/DataFlow";
import { PRISM_TEXT, PRISM_VAR } from "@/lib/data";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

export const metadata: Metadata = {
  title: "Our Vision",
  description:
    "Technology that moves with you. What Testsoft is building towards: systems that adapt, scale and keep creating value as the business changes.",
};

export const revalidate = 60;

/** Build → Transform → Scale → Evolve. */
const ARC = ["Build", "Transform", "Scale", "Evolve"];

const AMBITION = [
  { title: "Build", body: "Create modern technology solutions designed around real business challenges.", meta: "Software · Salesforce · Cloud · Data · AI · Enterprise Applications" },
  { title: "Enable", body: "Give organizations the technology, knowledge and people they need to operate with confidence.", meta: "" },
  { title: "Evolve", body: "Keep technology ready for the next business challenge, the next customer expectation, the next opportunity.", meta: "" },
];

const NOT_JUST = ["Not just implementation.", "Not just consulting.", "Not just staffing.", "Not just another vendor."];

const PARTNER = [
  "Understands the business",
  "Brings the right expertise",
  "Builds with the future in mind",
  "Helps your teams become stronger",
  "Stays focused on outcomes",
];

const OLD_WAY = ["Legacy system", "Replacement project", "Another replacement"];
const NEW_WAY = ["Modern foundation", "Connected data", "Automation & intelligence", "Continuous improvement", "New possibilities"];

/** The five ideas the future is built around. */
const IDEAS = [
  { n: "01", title: "Technology that evolves", image: "/vision/evolves.jpg", body: "Flexible solutions that adapt as organizations, customers and markets change." },
  { n: "02", title: "Intelligence everywhere", image: "/vision/intelligence.jpg", body: "Data, automation and AI used to help organizations decide faster and better." },
  { n: "03", title: "People + technology", image: "/vision/people.jpg", body: "Technology creates possibilities. People turn those possibilities into outcomes." },
  { n: "04", title: "Experiences that matter", image: "/vision/experiences.jpg", body: "Digital experiences that are simple, connected and designed around the people using them." },
  { n: "05", title: "Sustainable innovation", image: "/vision/sustainable.jpg", body: "Innovation with purpose: lasting business value rather than technology for its own sake." },
];

const AHEAD = [
  { k: "Salesforce", v: "Connected customer experiences" },
  { k: "Cloud", v: "Scalable digital foundations" },
  { k: "Data", v: "Insights that drive decisions" },
  { k: "AI", v: "Intelligence that accelerates work" },
  { k: "Automation", v: "Processes that work smarter" },
  { k: "Software", v: "Digital products built for change" },
  { k: "Enterprise Technology", v: "Connected systems for modern business" },
];

const NORTH_STAR = [
  "Teams can adapt quickly",
  "Data is accessible",
  "Systems work together",
  "Automation removes unnecessary complexity",
  "People spend more time on meaningful problems",
  "Technology is an advantage, not an operational burden",
];

const ROLES = ["Engineers", "Architects", "Consultants", "Data Specialists", "Salesforce Professionals", "Cloud Experts", "Project Leaders", "Technology Talent"];

const CHAIN = [
  { k: "People", v: "Technology expertise and specialized talent" },
  { k: "Technology", v: "Modern platforms, applications, data and cloud" },
  { k: "Solutions", v: "Business-focused technology solutions" },
  { k: "Outcomes", v: "Better experiences · Greater efficiency · Scalable growth" },
  { k: "Future", v: "A business ready for what comes next" },
];

const REMAINS = [
  "A stronger technology foundation",
  "Better-connected systems",
  "More capable teams",
  "Better access to information",
  "Greater operational efficiency",
  "A clearer path to innovation",
];

const TOMORROW = ["Adapt faster", "Learn faster", "Automate more", "Connect better", "Innovate continuously"];

export default function OurVisionPage() {
  return (
    <div style={{ "--page-accent": PRISM_VAR[5] } as React.CSSProperties}>
      <PageHeader
        eyebrow="Our Vision"
        flow
        title="Technology that moves with you"
        intro="Technology should never be built only for today. Our vision is to help organizations build technology that adapts, scales, evolves, and keeps creating value as the business changes."
      />

      {/* ---- from project to possibility ---- */}
      <section className="relative z-10 overflow-hidden bg-surface pt-10 sm:pt-12 pb-10 sm:pb-12">
        <SectionBackdrop from="bg-prism-violet" to="bg-prism-blue" />
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="max-w-3xl">
            <p className="mono-label label-accent mb-4">From project to possibility</p>
            <h2 className="display text-4xl sm:text-6xl text-ink leading-[1.05]">
              Most projects have an end date. Great technology <span className="text-brand italic">does not.</span>
            </h2>
          </Reveal>

          {/* the arc, drawn rather than listed */}
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ARC.map((a, i) => (
              <Reveal key={a} delay={i * 0.08} variant="rise">
                <div className="relative rounded-2xl border border-line bg-paper px-6 py-7 text-center">
                  <span aria-hidden className={`prism-wash pointer-events-none absolute inset-0 rounded-2xl ${PRISM_BG[(i + 5) % 6]}`} />
                  <span className={`relative display text-2xl sm:text-3xl ${PRISM_TEXT[(i + 5) % 6]}`}>{a}</span>
                  {i < ARC.length - 1 && (
                    <span aria-hidden className="arrow-flow pointer-events-none absolute -right-3 top-1/2 hidden text-xl text-brand lg:block">→</span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <p className="max-w-2xl text-graphite leading-relaxed">
              A successful initiative should create a foundation for what comes next, not another system
              waiting to be replaced the moment the business changes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- our ambition ---- */}
      <section className="relative z-10 bg-paper py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">Our ambition</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Build. Enable. <span className="text-brand italic">Evolve.</span>
            </h2>
          </Reveal>
          <ol className="grid gap-5 lg:grid-cols-3">
            {AMBITION.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.08} variant="tilt" duration={0.7}>
                <li className="card-lift group relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-10 transition-colors hover:border-brand/50">
                  <span aria-hidden className={`prism-wash pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full ${PRISM_BG[(i + 5) % 6]} blur-[90px] transition-opacity duration-500 group-hover:opacity-45`} />
                  <span aria-hidden className={`prism-rule relative block ${PRISM_BG[(i + 5) % 6]} origin-left transition-transform duration-500 group-hover:scale-x-[1.8]`} />
                  <h3 className="display relative text-2xl sm:text-4xl text-ink mt-6 group-hover:text-brand transition-colors">{a.title}</h3>
                  <p className="relative mt-4 text-ink/75 leading-relaxed">{a.body}</p>
                  {a.meta && <p className="relative mt-5 mono-label text-graphite leading-relaxed">{a.meta}</p>}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- a different kind of partnership ---- */}
      <section className="relative z-10 overflow-hidden bg-paper-tint/55 py-10 sm:py-12">
        <ConstellationField link={118} />
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-paper-tint/60" />
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-paper to-transparent" />
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-paper to-transparent" />
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20">
          <Reveal>
            <p className="mono-label label-accent mb-4">A different partnership</p>
            <div className="space-y-2">
              {NOT_JUST.map((n) => (
                <p key={n} className="display text-2xl sm:text-3xl text-ink/25 line-through decoration-brand/40">{n}</p>
              ))}
            </div>
            <p className="display text-3xl sm:text-5xl text-ink mt-6">
              A technology <span className="text-brand italic">partner.</span>
            </p>
          </Reveal>
          <Reveal delay={0.1} variant="rise" className="self-center">
            <ul className="space-y-4">
              {PARTNER.map((p, i) => (
                <li key={p} className="flex gap-4 text-lg text-ink/80 leading-relaxed">
                  <span aria-hidden className={`mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full ${PRISM_BG[i % 6]}`} />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---- momentum: the two paths, side by side ---- */}
      <section className="relative z-10 bg-paper py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">Technology should create momentum</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Every solution should open the door to what is <span className="text-brand italic">next.</span>
            </h2>
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal variant="right" duration={0.75}>
              <div className="h-full rounded-3xl border border-line bg-surface/60 p-8 sm:p-10">
                <p className="mono-label text-graphite mb-6">Instead of</p>
                <ol className="space-y-4">
                  {OLD_WAY.map((o) => (
                    <li key={o} className="flex items-center gap-4 text-lg text-ink/40 line-through decoration-ink/20">
                      <span aria-hidden className="h-px w-5 shrink-0 bg-ink/20" />
                      {o}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
            <Reveal delay={0.08} variant="left" duration={0.75}>
              <div className="relative h-full overflow-hidden rounded-3xl border border-brand/40 bg-surface p-8 sm:p-10">
                <span aria-hidden className="prism-wash-lg pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-brand blur-[90px]" />
                <p className="mono-label label-accent mb-6 relative">We believe in</p>
                <ol className="space-y-4 relative">
                  {NEW_WAY.map((n, i) => (
                    <li key={n} className="flex items-center gap-4 text-lg text-ink">
                      <span aria-hidden className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRISM_BG[i % 6]}`} />
                      {n}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
          <Reveal className="mt-10">
            <p className="max-w-2xl text-graphite leading-relaxed">
              Technology should become a platform for growth, not a limit on it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- the five ideas, each with its own picture ---- */}
      <section className="relative z-10 bg-surface/70 py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">Our future is built around five ideas</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Five things we are building <span className="text-brand italic">toward.</span>
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {IDEAS.map((idea, i) => (
              <Reveal key={idea.n} delay={(i % 3) * 0.06} variant="rise">
                <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-colors hover:border-brand/50">
                  <span className="relative block overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={idea.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="media-footage aspect-[16/10] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                    />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-paper via-paper/25 to-transparent" />
                    <span className={`absolute left-6 top-5 mono-label ${PRISM_TEXT[i % 6]}`}>{idea.n}</span>
                  </span>
                  <span className="flex flex-1 flex-col p-7">
                    <h3 className="display text-xl sm:text-2xl text-ink group-hover:text-brand transition-colors">{idea.title}</h3>
                    <p className="mt-3 text-sm text-graphite leading-relaxed">{idea.body}</p>
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- the technology ahead, over a band ---- */}
      <section className="relative z-10 bg-paper py-6 sm:py-8">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal variant="rise" duration={0.8}>
            {/* Live, not a still: nodes drift, links form from proximity, and
                packets actually travel along them. Masked at the edges so it
                has no frame. */}
            <div className="relative overflow-hidden">
              <span aria-hidden className="media-bleed pointer-events-none absolute inset-0">
                <DataFlow />
              </span>
              <span aria-hidden className="band-veil media-bleed pointer-events-none absolute inset-0" />
              <div className="relative px-7 py-12 sm:px-14 sm:py-16">
                <p className="mono-label label-accent mb-4">The technology we see ahead</p>
                <h2 className="display text-3xl sm:text-5xl text-ink max-w-3xl leading-[1.1]">
                  Not separate trends. Together they are shaping the next generation of
                  <span className="text-brand italic"> business.</span>
                </h2>
                <dl className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                  {AHEAD.map((a, i) => (
                    <div key={a.k} className="border-t border-line-blue/60 pt-4">
                      <dt className={`display text-lg ${PRISM_TEXT[i % 6]}`}>{a.k}</dt>
                      <dd className="mt-1 text-sm text-graphite leading-relaxed">{a.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- north star ---- */}
      <section className="relative z-10 bg-paper pb-10 sm:pb-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20">
          <Reveal>
            <p className="mono-label label-accent mb-4">Our north star</p>
            <h2 className="display text-3xl sm:text-5xl text-ink leading-[1.1]">
              Make technology an <span className="text-brand italic">advantage.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} variant="rise" className="self-center">
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {NORTH_STAR.map((n, i) => (
                <li key={n} className="flex gap-3 text-ink/80 leading-relaxed">
                  <span aria-hidden className={`mt-[0.7em] h-px w-4 shrink-0 ${PRISM_BG[i % 6]}`} />
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---- the people, then the chain ---- */}
      <section className="relative z-10 overflow-hidden bg-paper-tint/55 py-10 sm:py-12">
        <SectionBackdrop from="bg-prism-blue" to="bg-prism-violet" />
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="max-w-3xl">
            <p className="mono-label label-accent mb-4">The people behind the technology</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Technology changes. Talent makes it <span className="text-brand italic">possible.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <div className="flex flex-wrap gap-2.5">
              {ROLES.map((r, i) => (
                <span key={r} className={`mono-label rounded-full border border-line-blue px-4 py-2 ${PRISM_TEXT[i % 6]}`}>{r}</span>
              ))}
            </div>
            <p className="mt-7 text-graphite leading-relaxed max-w-2xl">
              Different expertise, one shared purpose: build what is next.
            </p>
          </Reveal>

          <ol className="mt-10 grid gap-4 lg:grid-cols-5">
            {CHAIN.map((c, i) => (
              <Reveal key={c.k} delay={i * 0.07} variant="rise">
                <li className="relative h-full rounded-2xl border border-line bg-surface p-6">
                  {i < CHAIN.length - 1 && (
                    <span aria-hidden className="arrow-flow pointer-events-none absolute -right-3.5 top-1/2 hidden text-xl text-brand lg:block">→</span>
                  )}
                  <p className={`mono-label ${PRISM_TEXT[i % 6]}`}>{c.k}</p>
                  <p className="mt-3 text-sm text-graphite leading-relaxed">{c.v}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- what success leaves behind ---- */}
      <section className="relative z-10 bg-paper py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">What success looks like</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              We measure our vision by what <span className="text-brand italic">remains.</span>
            </h2>
            <p className="mt-6 text-graphite leading-relaxed">
              An engagement should not end with a deployment. The real measure of technology is what it
              enables after implementation.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REMAINS.map((r, i) => (
              <Reveal key={r} delay={(i % 3) * 0.05} variant="tilt" duration={0.7}>
                <div className="card-lift group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-brand/50">
                  <span aria-hidden className={`prism-wash pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full ${PRISM_BG[i % 6]} blur-[60px] transition-opacity duration-500 group-hover:opacity-45`} />
                  <p className="relative text-lg text-ink/85 leading-relaxed">{r}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- tomorrow, and the promise ---- */}
      <section className="relative z-10 bg-surface/70 py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20">
          <Reveal>
            <p className="mono-label label-accent mb-4">Looking beyond today</p>
            <h2 className="display text-3xl sm:text-5xl text-ink leading-[1.1]">
              We do not know what technology looks like in ten years. We know what businesses will have to
              <span className="text-brand italic"> do.</span>
            </h2>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {TOMORROW.map((t, i) => (
                <li key={t} className={`mono-label rounded-full border border-line-blue px-4 py-2 ${PRISM_TEXT[i % 6]}`}>{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} variant="rise" className="self-center">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-paper p-8 sm:p-10">
              <span aria-hidden className="prism-wash-lg pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-prism-violet blur-[90px]" />
              <p className="relative mono-label label-accent mb-5">Our promise</p>
              <p className="relative text-graphite leading-relaxed">When we approach a technology challenge, we ask more than:</p>
              <p className="relative display text-xl sm:text-2xl text-ink/40 mt-3">“What needs to be built today?”</p>
              <p className="relative text-graphite leading-relaxed mt-6">We ask:</p>
              <p className="relative display text-2xl sm:text-4xl text-ink mt-3">
                “What will this enable <span className="text-brand italic">tomorrow?”</span>
              </p>
              <p className="relative mt-6 text-sm text-graphite leading-relaxed">
                That question shapes how we think about architecture, talent, delivery and partnership.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- close ---- */}
      <section className="relative z-10 bg-paper py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line-blue/60 bg-surface px-7 py-12 sm:px-14 sm:py-16">
              <span aria-hidden className="prism-wash-lg pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-prism-violet blur-[120px]" />
              <span aria-hidden className="prism-wash-lg pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-brand blur-[120px]" />
              <div className="relative max-w-3xl">
                <p className="mono-label label-accent mb-4">Technology. Talent. Transformation.</p>
                <h2 className="display text-4xl sm:text-6xl text-ink leading-[1.05]">
                  The future does not wait. Neither should your <span className="text-brand italic">technology.</span>
                </h2>
                <p className="mt-6 text-graphite leading-relaxed">
                  Modernizing the enterprise, transforming Salesforce, moving to the cloud, unlocking your
                  data, exploring AI, or building the next digital experience, we can help you move.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href="/contact#form" className="group btn-cta inline-flex items-center gap-3 rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-colors hover:bg-brand-deep">
                    Talk to an expert
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                  <Link href="/solutions" className="inline-flex items-center gap-2 rounded-full border border-line-blue px-6 py-3.5 font-medium text-ink transition-colors hover:border-brand/50 hover:text-brand">
                    Explore our solutions
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
