import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CtaBanner from "@/components/CtaBanner";
import PartnerStrip from "@/components/PartnerStrip";
import { getPractices, getCaseStudies } from "@/lib/site";
import { INDUSTRIES, PRISM_TEXT } from "@/lib/data";

/* ISR: practice copy is edited in /admin/site, so the page refreshes without
   waiting for a redeploy. */
export const revalidate = 60;

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

/** The delivery sequence the blueprint specifies for every practice page. */
const STEPS = [
  { n: "01", k: "Discover", b: "Stakeholders, objectives, constraints and the outcomes that matter." },
  { n: "02", k: "Design", b: "Target state, solution approach, roadmap and governance." },
  { n: "03", k: "Build", b: "Configuration, development and extension against the blueprint." },
  { n: "04", k: "Integrate", b: "Connecting the platform to the systems around it." },
  { n: "05", k: "Test", b: "Functional, automation, performance and security coverage." },
  { n: "06", k: "Launch", b: "Cutover, enablement and hypercare through go-live." },
  { n: "07", k: "Optimize", b: "Adoption, performance and the next round of improvement." },
];

/** Which industries each practice most often serves. */
const RELEVANT: Record<string, string[]> = {
  salesforce: ["sled", "utilities", "higher-education", "enterprise"],
  sap: ["manufacturing", "utilities", "enterprise"],
  oracle: ["manufacturing", "enterprise", "higher-education"],
  workday: ["higher-education", "healthcare", "enterprise"],
  infor: ["manufacturing", "utilities"],
  "application-development": ["sled", "healthcare", "enterprise"],
  "cloud-devops": ["sled", "enterprise", "healthcare"],
  "data-analytics": ["utilities", "higher-education", "enterprise"],
  "ai-automation": ["enterprise", "healthcare", "manufacturing"],
  "quality-engineering": ["sled", "healthcare", "enterprise"],
  mulesoft: ["utilities", "higher-education", "enterprise"],
  "api-integration": ["healthcare", "manufacturing", "enterprise"],
  "enterprise-integration": ["manufacturing", "utilities", "enterprise"],
};

const VANTA: Record<string, "globe" | "net" | "dots" | "waves" | "topology" | "halo"> = {
  salesforce: "globe", sap: "net", oracle: "dots", workday: "waves", infor: "topology",
  "application-development": "halo", "cloud-devops": "clouds" as never, "data-analytics": "dots",
  "ai-automation": "net", "quality-engineering": "waves", mulesoft: "globe",
  "api-integration": "net", "enterprise-integration": "topology",
};

export async function generateStaticParams() {
  const practices = await getPractices();
  return practices.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const practice = (await getPractices()).find((p) => p.id === slug);
  if (!practice) return { title: "Practice" };
  return { title: practice.name, description: practice.body.slice(0, 155) };
}

export default async function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [practices, cases] = await Promise.all([getPractices(), getCaseStudies()]);
  const practice = practices.find((p) => p.id === slug);
  if (!practice) notFound();

  const related = practices.filter((p) => p.id !== practice.id).slice(0, 4);
  const industries = (RELEVANT[practice.id] ?? ["enterprise"])
    .map((id) => INDUSTRIES.find((x) => x.id === id))
    .filter(Boolean) as typeof INDUSTRIES[number][];
  const proof = cases.slice(0, 2);

  return (
    <>
      <PageHeader
        eyebrow="Practices"
        vanta={VANTA[practice.id] ?? "net"}
        title={`${practice.name}, delivered.`}
        intro={practice.body}
      />

      {/* What we do + capabilities */}
      <section className="relative z-10 bg-surface/70 pt-16 sm:pt-24 pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-20 mb-16">
            <div>
              <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-4">What we do</p></Reveal>
              <Reveal delay={0.12}>
                <h2 className="display text-4xl sm:text-6xl text-ink">
                  Expertise, aligned to the <span className="text-brand italic">business.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <div className="flex h-full items-center">
                <p className="text-lg sm:text-xl text-ink/75 leading-relaxed">
                  We align {practice.name} expertise with business requirements, architecture, delivery and
                  long-term optimization — so the platform serves the outcome rather than the other way around.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mb-8" delay={0.05}>
            <p className="mono-label text-accent-deep">Capabilities</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {practice.stack.map((cap, i) => (
              <Reveal key={cap} delay={(i % 4) * 0.06}>
                <div className="card-lift group h-full bg-paper border border-line rounded-2xl p-7 hover:border-brand/50">
                  <span className={`display text-4xl ${PRISM_TEXT[i % 6]}`}>0{i + 1}</span>
                  <h3 className="display text-xl text-ink mt-5 group-hover:text-brand transition-colors">{cap}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery approach */}
      <section className="relative z-10 bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="mb-14">
            <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-4">Our delivery approach</p></Reveal>
            <Reveal delay={0.12}>
              <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">
                Seven steps, in the same <span className="text-brand italic">order.</span>
              </h2>
            </Reveal>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line-blue border border-line-blue rounded-2xl overflow-hidden">
            {STEPS.map((st, i) => (
              <Reveal key={st.n} delay={(i % 4) * 0.05} className="bg-surface p-7">
                <span className={`mono-label ${PRISM_TEXT[i % 6]}`}>{st.n}</span>
                <h3 className="display text-2xl text-ink mt-4">{st.k}</h3>
                <p className="mt-3 text-sm text-ink/70 leading-relaxed">{st.b}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Relevant industries */}
      <section className="relative z-10 bg-surface/70 py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="mb-14">
            <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-4">Relevant industries</p></Reveal>
            <Reveal delay={0.12}>
              <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">
                Where this practice goes <span className="text-brand italic">deepest.</span>
              </h2>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {industries.map((ind, i) => (
              <Reveal key={ind.id} delay={(i % 4) * 0.06}>
                <Link
                  href={`/industries#${ind.id}`}
                  className="card-lift group relative block h-full overflow-hidden bg-paper border border-line rounded-2xl p-7 hover:border-brand/50"
                >
                  <span aria-hidden className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full ${PRISM_BG[i % 6]} opacity-[0.12] blur-[70px] group-hover:opacity-25 transition-opacity duration-500`} />
                  <h3 className="relative display text-2xl text-ink group-hover:text-brand transition-colors">{ind.name}</h3>
                  <p className="relative mt-2 text-sm text-accent-deep">{ind.line}</p>
                  <span className="relative mt-6 block mono-label text-graphite group-hover:text-brand transition-colors">Explore →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      {proof.length > 0 && (
        <section className="relative z-10 bg-paper py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="mb-14">
              <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-4">Case studies &amp; proof</p></Reveal>
              <Reveal delay={0.12}>
                <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">
                  Work that has already <span className="text-brand italic">shipped.</span>
                </h2>
              </Reveal>
            </div>
            <div className="grid lg:grid-cols-2 gap-5">
              {proof.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.08}>
                  <Link href={`/company#client-success`} className="card-lift group block h-full overflow-hidden bg-surface border border-line rounded-2xl hover:border-brand/50">
                    {c.image && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={c.image} alt="" loading="lazy" decoding="async" className="h-48 w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
                    )}
                    <div className="p-7">
                      <p className={`mono-label ${PRISM_TEXT[i % 6]}`}>{c.industry}</p>
                      <h3 className="display text-2xl text-ink mt-3 group-hover:text-brand transition-colors">{c.title}</h3>
                      <p className="mt-3 text-sm text-ink/70 leading-relaxed">{c.outcome}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related practices */}
      <section className="relative z-10 bg-surface/70 py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-10"><p className="mono-label text-accent-deep">Related practices</p></Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((r, i) => (
              <Reveal key={r.id} delay={(i % 4) * 0.05}>
                <Link href={`/practices/${r.id}`} className="card-lift group block h-full bg-paper border border-line rounded-2xl p-6 hover:border-brand/50">
                  <h3 className="display text-xl text-ink group-hover:text-brand transition-colors">{r.name}</h3>
                  <p className="mt-2 mono-label text-accent-deep">{r.tag}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-paper">
        <PartnerStrip heading="Platform partners &amp; clients" title="Certified across the platforms we deliver." variant="grid" />
      </div>

      <CtaBanner
        eyebrow="Practices"
        heading={`Talk to a ${practice.name} expert.`}
        body="Tell us what you are trying to achieve on the platform, and we will bring the people who have done it before."
      />
    </>
  );
}
