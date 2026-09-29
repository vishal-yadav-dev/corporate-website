import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import PartnerStrip from "@/components/PartnerStrip";
import Leadership from "@/components/Leadership";
import ScrollStory from "@/components/ScrollStory";
import VantaBg from "@/components/VantaBg";
import { LOCATIONS, METRICS, PRISM_TEXT } from "@/lib/data";
import { getAwards, getLeaders, getCaseStudies, getTestimonials } from "@/lib/site";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

const APPROACH = [
  { n: "01", title: "Understand", body: "We listen to stakeholders, document objectives, understand constraints, and identify the outcomes that matter." },
  { n: "02", title: "Architect", body: "We define the target state, solution approach, delivery roadmap, and the capabilities required to get there." },
  { n: "03", title: "Execute", body: "We build, configure, integrate, test, deploy, and staff the work with the right specialists." },
  { n: "04", title: "Improve", body: "We support adoption, optimize performance, and identify the next opportunities for improvement." },
];

const WHY = [
  { kicker: "Technology + Talent", title: "Two capabilities, one partner", body: "Clients can engage us for technology solutions, workforce solutions, or a combination of both — without stitching together separate vendors for the build and the people who run it." },
  { kicker: "Flexible Delivery", title: "Structured around your engagement", body: "Support can be structured around consulting, project delivery, staff augmentation, direct hire, or SOW engagements — whichever model fits the work and the budget." },
  { kicker: "Enterprise Mindset", title: "Built for complex organizations", body: "Our delivery approach is designed around complex organizations, enterprise platforms, public-sector environments, and regulated industries where auditability matters." },
  { kicker: "People-Centered", title: "Communication that holds up", body: "Strong communication and practical coordination remain central to both the client and the candidate experience — from first conversation through hypercare." },
];

export const metadata: Metadata = {
  title: "Company",
  description: "About Testsoft Technologies — leadership, awards, delivery centers, and corporate responsibility.",
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
        eyebrow="Company"
        title="Where expertise meets execution."
        intro="Testsoft Technologies is a technology services and talent solutions company helping organizations solve complex technology challenges and build the teams required to execute them."
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
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">Meet the leaders behind the work.</h2>
          </Reveal>
          <Leadership initialLeaders={LEADERS} />
        </div>
      </section>

      <section id="awards" className="relative z-10 bg-surface/70 py-24 sm:py-32 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-16">
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
                      <p className="text-ink/90 text-[15px] leading-snug mt-1">{a.title}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach — numbered process, per the blueprint */}
      <section id="approach" className="relative z-10 bg-surface/70 py-24 sm:py-32 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-16">
            <p className="mono-label text-accent-deep mb-4">Our Approach</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">A practical approach to complex technology challenges.</h2>
            <p className="mt-6 max-w-2xl text-graphite leading-relaxed">
              We bring structure to complex technology initiatives without creating unnecessary process.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {APPROACH.map((a, i) => (
              <Reveal key={a.n} delay={(i % 4) * 0.05}>
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

      <div className="bg-paper/55">        <ScrollStory eyebrow="Why Testsoft" heading="Built for complex technology work." items={WHY} />
      </div>

      <section id="delivery" className="relative z-10 bg-paper-tint/55 py-24 sm:py-32 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-16">
            <p className="mono-label text-accent-deep mb-4">Delivery Centers</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">Connected delivery, US-centered.</h2>
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

      {/* Public buyers arrive here looking for the contract they can order
          against, so the company story hands off to it directly. */}
      <section id="contract-vehicles" className="relative z-10 bg-paper py-16 sm:py-20 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal>
            <Link
              href="/company/contract-vehicles"
              className="group flex flex-col gap-6 rounded-[28px] border border-line bg-surface px-7 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-11 transition-colors hover:border-brand/50"
            >
              <div>
                <p className="mono-label text-accent-deep mb-3">Public sector</p>
                <h2 className="display text-2xl sm:text-4xl text-ink">
                  Government contract <span className="text-brand italic">vehicles</span>
                </h2>
                <p className="mt-4 max-w-2xl text-graphite leading-relaxed">
                  Agencies can buy through TIPS, Texas DIR, GSA and other pre-competed contracts —
                  no new solicitation required.
                </p>
              </div>
              <span className="mono-label text-accent-deep whitespace-nowrap group-hover:text-brand transition-colors">
                See the vehicles →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="csr" className="relative z-10 bg-surface/70 py-24 sm:py-32 scroll-mt-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <Reveal>
              <p className="mono-label text-accent-deep mb-4">Corporate Social Responsibility</p>
              <h2 className="display text-5xl sm:text-6xl text-ink">NGO USA</h2>
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

      {/* Client success — case studies, then the two testimonial walls. Each
          section renders only when there is real material to show. */}
      {CASES.length > 0 && (
        <section id="case-studies" className="relative z-10 bg-paper py-24 sm:py-32 scroll-mt-24">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="mb-16">
              <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-4">Case Studies</p></Reveal>
              <Reveal delay={0.12}>
                <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">
                  Technology solutions in <span className="text-brand italic">action.</span>
                </h2>
              </Reveal>
            </div>

            <div className="space-y-6 scene" style={{ perspective: 1400 }}>
              {CASES.map((c, i) => (
                <Reveal key={c.id} delay={0.05}>
                  <article
                    id={c.id}
                    className={`card-3d group scroll-mt-28 relative grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-14 bg-surface border border-line rounded-[28px] overflow-hidden hover:border-brand/50 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
                  >
                    <span aria-hidden className={`pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full ${PRISM_BG[i % 6]} opacity-[0.10] blur-[100px] group-hover:opacity-20 transition-opacity duration-500`} />
                    {c.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={c.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover min-h-[220px] transition-transform duration-[900ms] ease-out group-hover:scale-105" />
                    ) : (
                      <div className={`${PRISM_BG[i % 6]} min-h-[220px] opacity-20`} />
                    )}
                    <div className="relative p-8 sm:p-12">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`mono-label ${PRISM_TEXT[i % 6]}`}>{c.industry}</span>
                        {c.client && <span className="mono-label text-graphite">· {c.client}</span>}
                      </div>
                      <h3 className="display text-3xl sm:text-4xl text-ink mt-4">{c.title}</h3>

                      <dl className="mt-7 space-y-4 max-w-xl">
                        {[["Challenge", c.challenge], ["Approach", c.approach], ["Solution", c.solution], ["Outcome", c.outcome]]
                          .filter(([, v]) => v)
                          .map(([k, v]) => (
                            <div key={k}>
                              <dt className="mono-label text-accent-deep">{k}</dt>
                              <dd className="mt-1.5 text-sm text-ink/75 leading-relaxed">{v}</dd>
                            </div>
                          ))}
                      </dl>

                      {c.technology.length > 0 && (
                        <div className="mt-7 flex flex-wrap gap-2">
                          {c.technology.map((t) => (
                            <span key={t} className="mono-label text-graphite border border-line-blue rounded-full px-3 py-1.5">{t}</span>
                          ))}
                        </div>
                      )}

                      {c.quote && (
                        <figure className="mt-8 border-l-2 border-brand/50 pl-5">
                          <blockquote className="text-lg text-ink/85 leading-relaxed">&ldquo;{c.quote}&rdquo;</blockquote>
                          {c.quoteBy && <figcaption className="mt-2 text-sm text-graphite">{c.quoteBy}</figcaption>}
                        </figure>
                      )}

                      {c.deliveryModel && (
                        <p className="mt-7 mono-label text-graphite">Delivery model — {c.deliveryModel}</p>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {CLIENT_QUOTES.length > 0 && (
        <section id="client-testimonials" className="relative z-10 bg-surface/70 py-24 sm:py-32 scroll-mt-24">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="mb-14">
              <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-4">Client Testimonials</p></Reveal>
              <Reveal delay={0.12}>
                <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">
                  What our clients <span className="text-brand italic">say.</span>
                </h2>
              </Reveal>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CLIENT_QUOTES.map((t, i) => (
                <Reveal key={i} delay={(i % 3) * 0.06}>
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
        <section id="candidate-testimonials" className="relative z-10 bg-paper py-24 sm:py-32 scroll-mt-24">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="mb-14">
              <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-4">Candidate Testimonials</p></Reveal>
              <Reveal delay={0.12}>
                <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">
                  Trusted by technology <span className="text-brand italic">professionals.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-2xl text-graphite leading-relaxed">
                  Communication, transparency, interview support, onboarding and ongoing contact — what
                  technology professionals say about working with us.
                </p>
              </Reveal>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CANDIDATE_QUOTES.map((t, i) => (
                <Reveal key={i} delay={(i % 4) * 0.06}>
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

      <div className="bg-surface/70">
        <PartnerStrip heading="Clients & Partners" title="The organizations we build alongside." variant="grid" />
      </div>
      <CtaBanner
        eyebrow="Company"
        heading="Why Testsoft? Let’s talk."
        body="Technology solutions, workforce solutions, or both — tell us what you are trying to achieve and we will bring the capabilities required to execute."
      />
      </div>
    </div>
  );
}
