import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import PartnerStrip from "@/components/PartnerStrip";
import Leadership from "@/components/Leadership";
import ScrollStory from "@/components/ScrollStory";
import ConstellationField from "@/components/ConstellationField";
import VantaBg from "@/components/VantaBg";
import { LOCATIONS, METRICS, PRISM_TEXT } from "@/lib/data";
import { getAwards, getLeaders, getCaseStudies, getTestimonials } from "@/lib/site";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

/* Four steps, though the section is titled "Understand. Align. Deliver." —
   the heading names the shape of the engagement, the list is how it runs. */
const APPROACH = [
  { n: "01", title: "Understand", body: "We start by understanding your business, technology environment, project objectives, and workforce requirements." },
  { n: "02", title: "Align", body: "We identify the right combination of skills, people, delivery model, and engagement structure for the requirement." },
  { n: "03", title: "Deliver", body: "We focus on speed, quality, communication, and accountability throughout the engagement, from the first candidate submission to successful delivery." },
  { n: "04", title: "Evolve", body: "Technology does not stand still. We continuously look for opportunities to optimize, modernize, automate, and improve the solution as business needs evolve." },
];

/** What we do, across the technology lifecycle. */
const CAPABILITIES = [
  { title: "Software Engineering", body: "Design, develop, modernize, and maintain enterprise applications using modern software engineering practices and technologies." },
  { title: "Salesforce Solutions", body: "Help organizations maximize the Salesforce platform through implementation, customization, integration, development, and specialized Salesforce expertise." },
  { title: "Cloud & Digital Transformation", body: "Support cloud adoption, modernization, migration, integration, and digital transformation initiatives." },
  { title: "Data & Analytics", body: "Build data capabilities that turn information into actionable business insight through data engineering, analytics, reporting, and modern data platforms." },
  { title: "Enterprise Technology", body: "Support complex enterprise environments across applications, platforms, integrations, ERP, CRM, and other mission-critical systems." },
  { title: "Technology Talent & Workforce Solutions", body: "Where additional expertise is required, we provide specialized technology professionals, project teams, and flexible workforce models to complement internal teams." },
];

/** Why a client picks us — the differentiators, stated plainly. */
const DIFFERENT = [
  { title: "Specialized expertise", body: "Talent across high-demand skill areas including cloud, software engineering, data, enterprise applications, Salesforce, SAP and DevOps." },
  { title: "Responsive delivery", body: "A dedicated recruiting and delivery approach, so we can move when requirements and priorities change." },
  { title: "Quality-focused recruiting", body: "Our process emphasises technical alignment, qualification and communication, so clients spend less time sorting through mismatched profiles." },
  { title: "Flexible engagement models", body: "From individual consultants to project-based teams, structured around your workforce and delivery requirements." },
  { title: "Partnership mindset", body: "We measure success by the value created for the client, not by the number of positions filled." },
];

/* Built around people: the four values, on the sticky narrative device. Four
   values, four images that already exist — they line up. */
const WHY = [
  { kicker: "Accountability", title: "We own what we commit to", body: "Ownership of commitments, and clear communication throughout the engagement, including when something is not going to plan.", image: "/company/technology-talent.jpg" },
  { kicker: "Collaboration", title: "We solve it alongside you", body: "We work closely with clients, consultants and partners to solve problems together rather than over a ticket queue.", image: "/company/flexible-delivery.jpg" },
  { kicker: "Continuous learning", title: "The stack keeps moving", body: "Technology changes quickly. Our teams continuously expand their knowledge of emerging platforms, technologies and market needs.", image: "/company/enterprise-mindset.jpg" },
  { kicker: "Integrity", title: "Long relationships, not transactions", body: "Long-term relationships are built on transparency, trust, and doing what we said we would do.", image: "/company/people-centered.jpg" },
];

export const metadata: Metadata = {
  title: "Who We Are",
  description: "About Testsoft Technologies: leadership, awards, delivery centers, and corporate responsibility.",
};


/* ISR: matches the homepage — leadership and award edits made in /admin appear
   within a minute instead of waiting for a redeploy. */
export const revalidate = 60;

export default async function CompanyPage() {
  const [AWARDS, LEADERS, CASES, CLIENT_QUOTES, CANDIDATE_QUOTES] = await Promise.all([
    getAwards(), getLeaders(), getCaseStudies(), getTestimonials("client"), getTestimonials("candidate"),
  ]);
  return (
    <div className="relative">
      {/* Full-page topology, pinned to the viewport, theme-matched */}
      <VantaBg effect="topology" fixed />

      <div className="relative z-10">
      <PageHeader
        eyebrow="Who We Are"
        title="Technology. Talent. Transformation."
        intro="We help organizations turn technology goals into business outcomes by bringing together the right people, the right expertise, and the right technology solutions."
      />

      <section id="about" className="relative z-10 bg-surface/70 pt-12 sm:pt-16 pb-16 scroll-mt-14">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            <Reveal>
              <p className="mono-label label-accent mb-4">About</p>
              <p className="text-2xl sm:text-3xl text-ink display leading-tight">
                A Texas-based IT services and talent solutions company.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="space-y-5 text-graphite leading-relaxed self-center">
              <p>We support organizations with technology consulting, workforce solutions, and specialized IT talent. From scaling an engineering team to supporting enterprise technology initiatives, we help clients move from need to execution, faster, and with greater confidence.</p>
              <p>Our approach combines the agility of a specialized technology company with the delivery discipline of an experienced workforce partner.</p>
              <p>We don&apos;t just provide resources. We help build the teams and capabilities that move businesses forward.</p>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-2xl overflow-hidden">
            {METRICS.map((m, i) => (
              <div key={m.label} className="bg-paper p-8">
                <p className={`display text-4xl sm:text-5xl ${PRISM_TEXT[i % 6]}`}>{m.value}</p>
                <p className="mt-2 text-xs text-graphite">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="relative z-10 bg-paper py-14 sm:py-18 scroll-mt-14">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20">
          <Reveal>
            <p className="mono-label label-accent mb-4">Our Story</p>
            <h2 className="display text-4xl sm:text-6xl text-ink leading-[1.05]">
              Built on a simple <span className="text-brand italic">idea.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-graphite leading-relaxed self-center">
            <p>Technology works better when the right expertise is connected to the right business challenge.</p>
            <p>What began as a technology talent and workforce solutions company has grown into a broader technology services partner: software engineering, enterprise applications, cloud, data, Salesforce, and specialized technology services.</p>
            <p>That growth has been driven by one principle: understanding what a client actually needs before deciding how we can help. It means looking past keywords and job descriptions to the business objective, the existing environment, the delivery model and the expected outcome, then building the solution around them.</p>
            <p>Our workforce capabilities complement that, letting us put specialized professionals and teams in place when an organization needs to scale quickly.</p>
          </Reveal>
        </div>
      </section>

      <section id="what-we-do" className="relative z-10 bg-surface/70 py-14 sm:py-18 scroll-mt-14">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">What We Do</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Technology solutions powered by <span className="text-brand italic">expertise.</span>
            </h2>
            <p className="mt-6 text-graphite leading-relaxed">
              Organizations need more than an implementation. They need solutions that align with business
              objectives, fit the environment already in place, and deliver measurable value.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 0.05} variant="rise">
                <article className="card-lift group relative h-full overflow-hidden rounded-2xl border border-line bg-paper p-7 transition-colors hover:border-brand/50">
                  <span
                    aria-hidden
                    className={`prism-wash pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full ${PRISM_BG[i % 6]} blur-[70px] transition-opacity duration-500 group-hover:opacity-45`}
                  />
                  <span aria-hidden className={`prism-rule relative block ${PRISM_BG[i % 6]} origin-left transition-transform duration-500 group-hover:scale-x-[1.8]`} />
                  <h3 className="display relative text-xl sm:text-2xl text-ink mt-5 group-hover:text-brand transition-colors">{c.title}</h3>
                  <p className="relative mt-3 text-sm text-graphite leading-relaxed">{c.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <p className="text-graphite leading-relaxed max-w-2xl">
              Technology is at the centre of what we do. Talent is what lets us deliver it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Vision and Diversity & Inclusion are pages now. This is the handoff —
          the dropdown reaches them directly, and so does a reader working down
          this page. */}
      <section className="relative z-10 bg-paper-tint/55 py-14 sm:py-18">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 grid gap-5 md:grid-cols-2">
          {[
            {
              href: "/company/our-vision",
              eyebrow: "Our Vision",
              title: "Technology that outlives the project.",
              body: "Most programmes are judged on go-live day. We would rather be judged a year later, on whether the platform still fits and the team can change it without us.",
              accent: 5,
            },
            {
              href: "/company/diversity-inclusion",
              eyebrow: "Diversity & Inclusion",
              title: "A certified minority business.",
              body: "A Minority Business Enterprise and Small Business Enterprise: what that lets an agency count, and what it obliges in how we hire and staff.",
              accent: 3,
            },
          ].map((c, i) => (
            <Reveal key={c.href} delay={i * 0.08} variant={i ? "left" : "right"} duration={0.75}>
              <Link
                href={c.href}
                className="card-lift group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-11 hover:border-brand/50"
              >
                <span
                  aria-hidden
                  className={`prism-wash pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full ${PRISM_BG[c.accent]} blur-[90px] transition-opacity duration-500 group-hover:opacity-40`}
                />
                <span className={`relative mono-label ${PRISM_TEXT[c.accent]}`}>{c.eyebrow}</span>
                <h3 className="relative display text-2xl sm:text-4xl text-ink mt-4 group-hover:text-brand transition-colors">
                  {c.title}
                </h3>
                <p className="relative mt-5 text-graphite leading-relaxed">{c.body}</p>
                <span className="relative mt-8 inline-flex items-center gap-2 mono-label label-accent group-hover:text-brand transition-colors">
                  Read more
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="leadership" className="relative z-10 bg-paper-tint/55 py-16 sm:py-20 scroll-mt-14">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-10">
            <p className="mono-label text-accent-deep mb-4">Leadership</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">Meet the leaders behind the work.</h2>
          </Reveal>
          <Leadership initialLeaders={LEADERS} />
        </div>
      </section>

      <section id="awards" className="relative z-10 bg-surface/70 py-16 sm:py-20 scroll-mt-14">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-10">
            <p className="mono-label text-accent-deep mb-4">Awards & Recognition</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">Committed to responsible and inclusive business.</h2>
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
                      <p className="text-ink/90 text-[0.9375rem] leading-snug mt-1">{a.title}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach — numbered process, per the blueprint */}
      <section id="approach" className="relative z-10 bg-surface/70 py-16 sm:py-20 scroll-mt-14">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-10">
            <p className="mono-label text-accent-deep mb-4">Our Approach</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">Understand. Align. Deliver.</h2>
            <p className="mt-6 max-w-2xl text-graphite leading-relaxed">
              Every organization has different priorities, talent requirements and delivery challenges, so we do not work to a single template. The result is a partnership designed around your objectives, not a transaction.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {APPROACH.map((a, i) => (
              <Reveal key={a.n} delay={(i % 4) * 0.05} variant="tilt" duration={0.7}>
                <div className="card-lift group h-full bg-paper border border-line rounded-2xl p-7 hover:border-brand/50">
                  <p className={`display text-5xl ${PRISM_TEXT[i % 6]}`}>{a.n}</p>
                  <h3 className="display text-2xl text-ink mt-5 group-hover:text-brand transition-colors">{a.title}</h3>
                  <p className="mt-3 text-sm text-ink/75 leading-relaxed">{a.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="different" className="relative z-10 bg-paper-tint/55 py-14 sm:py-18 scroll-mt-14">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">What makes us different</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Technology expertise, with a talent-first <span className="text-brand italic">mindset.</span>
            </h2>
            <p className="mt-6 text-graphite leading-relaxed">
              Technology projects succeed when the right expertise is available at the right time. Our
              recruiting and delivery teams understand both sides of that, the technology and the talent.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENT.map((d, i) => (
              <Reveal key={d.title} delay={(i % 3) * 0.05} variant="tilt" duration={0.7}>
                <article className="card-lift group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-brand/50">
                  <span
                    aria-hidden
                    className={`prism-wash pointer-events-none absolute -left-14 -bottom-14 h-40 w-40 rounded-full ${PRISM_BG[(i + 2) % 6]} blur-[70px] transition-opacity duration-500 group-hover:opacity-45`}
                  />
                  <h3 className={`display relative text-xl sm:text-2xl ${PRISM_TEXT[(i + 2) % 6]}`}>{d.title}</h3>
                  <p className="relative mt-3 text-sm text-graphite leading-relaxed">{d.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-paper/55">        <ScrollStory eyebrow="Built Around People" heading="Technology powers it. People make it happen." items={WHY} />
      </div>

      <section id="delivery" className="relative z-10 bg-paper-tint/55 py-16 sm:py-20 scroll-mt-14">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-10">
            <p className="mono-label text-accent-deep mb-4">Delivery Centers</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">Connected delivery, US-centered.</h2>
            <p className="mt-6 max-w-2xl text-graphite">Physical offices across the US, Mexico, and India, registered to serve the USA, Canada, UK, Spain, Mexico, Argentina, Brazil, Peru, and beyond.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {LOCATIONS.map((loc, i) => (
              <Reveal key={loc.region} delay={(i % 2) * 0.06} variant="rise">
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

      <section id="csr" className="relative z-10 overflow-hidden bg-surface py-16 sm:py-20 scroll-mt-14">
        {/* A connected field rather than footage: the programmes here are about
            people linked to each other, and the network draws exactly that. The
            client's own video can take this slot later — it is one swap. */}
        <ConstellationField />
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-surface/55" />
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-surface to-transparent" />
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" />
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <Reveal>
              <p className="mono-label text-accent-deep mb-4">Corporate Social Responsibility</p>
              <h2 className="display text-5xl sm:text-6xl text-ink">NGO USA</h2>
              <p className="mt-6 text-graphite leading-relaxed">To educate, enrich, empower, and elevate members of the community into a flourishing relationship of fraternity, inspiring mutual help and cooperation toward positive economic, social, and cultural growth.</p>
              <Link href="/contact#form" className="mt-8 inline-flex items-center gap-2 text-brand hover:gap-3 transition-all">Get involved →</Link>
            </Reveal>
            <Reveal delay={0.1} className="grid sm:grid-cols-2 gap-4">
              {["FIRE: Investments","ASARA: Students, Training & Jobs","BEST: Entrepreneurship","Real Women Power","Immigration Support","Community Affairs"].map((p) => (
                <div key={p} className="bg-paper border border-line rounded-xl p-5 text-sm text-ink/80">{p}</div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Client success — case studies, then the two testimonial walls. Each
          section renders only when there is real material to show. */}
      {CASES.length > 0 && (
        <section id="success-stories" className="relative z-10 bg-paper py-14 sm:py-18 scroll-mt-14">
          <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <div>
                <Reveal delay={0.05}><p className="mono-label label-accent mb-4">Partner Success Stories</p></Reveal>
                <Reveal delay={0.12}>
                  <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">
                    The work, told one engagement at a <span className="text-brand italic">time.</span>
                  </h2>
                </Reveal>
              </div>
              <Reveal delay={0.18}>
                <Link href="/success-stories" className="group inline-flex items-center gap-2 mono-label label-accent hover:text-brand transition-colors">
                  All stories
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </Reveal>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CASES.map((c, i) => (
                <Reveal key={c.id} delay={(i % 3) * 0.06} variant="rise">
                  <Link
                    href={`/success-stories/${c.id}`}
                    className="card-lift group relative flex h-full flex-col overflow-hidden rounded-[1.375rem] border border-line bg-surface transition-colors hover:border-brand/50"
                  >
                    {c.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image} alt="" loading="lazy" decoding="async"
                        className="aspect-[16/10] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
                    )}
                    <span className="flex flex-1 flex-col p-7">
                      <span className={`mono-label ${PRISM_TEXT[i % 6]}`}>{c.industry || "Case study"}</span>
                      <span className="display mt-3 text-2xl text-ink leading-[1.15] group-hover:text-brand transition-colors">{c.title}</span>
                      {c.outcome && <span className="mt-3 text-sm text-graphite leading-relaxed line-clamp-3">{c.outcome}</span>}
                      <span className="mt-6 inline-flex items-center gap-2 mono-label label-accent group-hover:text-brand transition-colors">
                        Read the story
                        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {CLIENT_QUOTES.length > 0 && (
        <section id="client-testimonials" className="relative z-10 bg-surface/70 py-16 sm:py-20 scroll-mt-14">
          <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
            <div className="mb-10">
              <Reveal delay={0.05}><p className="mono-label label-accent mb-4">Client Testimonials</p></Reveal>
              <Reveal delay={0.12}>
                <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">
                  What our clients <span className="text-brand italic">say.</span>
                </h2>
              </Reveal>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CLIENT_QUOTES.map((t, i) => (
                <Reveal key={i} delay={(i % 3) * 0.06} variant="zoom">
                  <figure className="card-lift h-full bg-paper border border-line rounded-2xl p-7 hover:border-brand/50">
                    <span aria-hidden className={`block h-px w-10 ${PRISM_BG[i % 6]} mb-5 opacity-70`} />
                    <blockquote className="text-lg text-ink/85 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="mt-6 text-sm">
                      <span className="text-ink">{t.person}</span>
                      {t.organization && <span className="text-graphite"> · {t.organization}</span>}
                      {t.context && <span className="mt-1.5 block mono-label text-accent-deep">{t.context}</span>}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {CANDIDATE_QUOTES.length > 0 && (
        <section id="candidate-testimonials" className="relative z-10 bg-paper py-16 sm:py-20 scroll-mt-14">
          <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
            <div className="mb-10">
              <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-4">Employee Testimonials</p></Reveal>
              <Reveal delay={0.12}>
                <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">
                  Trusted by technology <span className="text-brand italic">professionals.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-2xl text-graphite leading-relaxed">
                  Communication, transparency, interview support, onboarding and ongoing contact: what
                  technology professionals say about working with us.
                </p>
              </Reveal>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CANDIDATE_QUOTES.map((t, i) => (
                <Reveal key={i} delay={(i % 4) * 0.06} variant="left">
                  <figure className="card-lift h-full bg-surface border border-line rounded-2xl p-6 hover:border-brand/50">
                    <blockquote className="text-ink/85 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="mt-5 text-sm text-graphite">
                      {t.person}
                      {t.context && <span className={`mt-1.5 block mono-label ${PRISM_TEXT[i % 6]}`}>{t.context}</span>}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="whats-next" className="relative z-10 bg-paper-tint/55 py-14 sm:py-18 scroll-mt-14">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20">
          <Reveal>
            <p className="mono-label label-accent mb-4">Built for what comes next</p>
            <h2 className="display text-4xl sm:text-6xl text-ink leading-[1.05]">
              The future belongs to organizations that can move with <span className="text-brand italic">change.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-graphite leading-relaxed self-center">
            <p>Cloud platforms, artificial intelligence, data, automation, enterprise applications and digital experiences are reshaping how organizations operate, and the pace is not slowing.</p>
            <p>Our focus is not simply filling today&apos;s technology gaps. It is helping organizations build the skills, teams and capabilities they will need next.</p>
            <p>We keep expanding our technology expertise, strengthening delivery, and developing solutions that help organizations adapt to an increasingly digital world.</p>
          </Reveal>
        </div>
      </section>

      <div className="bg-surface/70">
        <PartnerStrip heading="Clients & Partners" title="The organizations we build alongside." />
      </div>
      {/* Two routes on purpose: the supplied copy offers both "talk to us" and
          "see the solutions", and they are different readers. */}
      <section className="relative z-10 bg-paper-tint/55 py-14 sm:py-18">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line-blue/60 bg-surface px-7 py-12 sm:px-14 sm:py-16">
              <span aria-hidden className="prism-wash-lg pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-prism-blue blur-[120px]" />
              <span aria-hidden className="prism-wash-lg pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-prism-violet blur-[120px]" />
              <div className="relative max-w-3xl">
                <p className="mono-label label-accent mb-4">Let&apos;s build what&apos;s next</p>
                <h2 className="display text-4xl sm:text-6xl text-ink leading-[1.05]">
                  Tell us what you are trying to <span className="text-brand italic">accomplish.</span>
                </h2>
                <p className="mt-6 text-graphite leading-relaxed">
                  Whether you need to scale a technology team, find specialized talent, support a critical
                  project, or build a long-term capability, we will help you work out the right way forward.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/contact#form"
                    className="group btn-cta inline-flex items-center gap-3 rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-colors hover:bg-brand-deep"
                  >
                    Talk to our experts
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                  <Link
                    href="/solutions"
                    className="inline-flex items-center gap-2 rounded-full border border-line-blue px-6 py-3.5 font-medium text-ink transition-colors hover:border-brand/50 hover:text-brand"
                  >
                    Explore our solutions
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      </div>
    </div>
  );
}
