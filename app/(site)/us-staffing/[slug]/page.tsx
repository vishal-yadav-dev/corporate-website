import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CtaBanner from "@/components/CtaBanner";
import CountUp from "@/components/CountUp";
import StackedStory from "@/components/StackedStory";
import { getStaffing, getCaseStudies } from "@/lib/site";
import { INDUSTRIES, STAFFING_STATS, PRISM_TEXT } from "@/lib/data";
import { SOLUTION_DETAIL } from "@/lib/detail";

/* ISR: solution copy is edited in /admin/site. */
export const revalidate = 60;

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

/** The business problem each solution answers, in the buyer's words. */
const CHALLENGE: Record<string, string> = {
  "staff-augmentation": "Specialist skills are needed now, hiring takes months, and the roadmap will not wait for a req to close.",
  "contingent-workforce": "Demand moves in cycles, but headcount does not — and every short-term hire brings compliance overhead with it.",
  "direct-hire": "A permanent role has stayed open too long, and the shortlists arriving are not technically calibrated.",
  "sow-project-teams": "The outcome matters more than the hours, and the work needs one party accountable for delivering it.",
  "managed-workforce": "Contingent labour is spread across vendors with no single view of spend, compliance or performance.",
};

/** Delivery models available for each solution. */
const MODELS: Record<string, string[]> = {
  "staff-augmentation": ["Time & materials", "Contract-to-hire", "Onshore / nearshore / offshore"],
  "contingent-workforce": ["Payrolling", "Employer of record", "Project-based hiring"],
  "direct-hire": ["Contingent search", "Retained search", "Calibrated shortlists"],
  "sow-project-teams": ["Fixed scope", "Milestone-based", "Managed delivery"],
  "managed-workforce": ["MSP programme", "VMS integration", "Consolidated reporting"],
};

export async function generateStaticParams() {
  const solutions = await getStaffing();
  return solutions.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = (await getStaffing()).find((s) => s.id === slug);
  if (!solution) return { title: "Solution" };
  return { title: solution.name, description: solution.body.slice(0, 155) };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [solutions, cases] = await Promise.all([getStaffing(), getCaseStudies()]);
  const solution = solutions.find((s) => s.id === slug);
  if (!solution) notFound();

  const d = SOLUTION_DETAIL[slug];
  const accent = d?.accent ?? 1;
  const variant = d?.variant ?? "split";
  const siblings = solutions.filter((s) => s.group === solution.group);
  const related = siblings.filter((s) => s.id !== solution.id);
  const models = MODELS[solution.id] ?? [];
  const proof = cases.slice(0, 2);

  return (
    <>
      <PageHeader
        eyebrow={solution.group === "technology" ? "Technology Solutions" : "Workforce Solutions"}
        vanta={d?.vanta ?? "fog"}
        title={d?.headline ?? `${solution.name}.`}
        intro={d?.lead ?? solution.line}
      />

      {/* ---- Opening: arrangement varies per solution ---- */}
      <section className="relative z-10 bg-surface/70 pt-16 sm:pt-24 pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          {variant === "split" && (
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              <Reveal delay={0.05}>
                <div className="h-full bg-paper border border-line rounded-[28px] p-8 sm:p-12">
                  <p className="mono-label text-accent-deep mb-5">The business challenge</p>
                  <p className="text-xl sm:text-2xl text-ink leading-relaxed">
                    {CHALLENGE[solution.id] ?? "Technology plans move faster than the teams available to deliver them."}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.14}>
                <div className="relative h-full overflow-hidden bg-surface border border-line-blue/60 rounded-[28px] p-8 sm:p-12">
                  <span aria-hidden className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full ${PRISM_BG[accent]} prism-wash-lg blur-[100px]`} />
                  <p className="relative mono-label text-accent-deep mb-5">{d?.whatHeading ?? "Our solution"}</p>
                  <p className="relative text-lg text-ink/80 leading-relaxed">{d?.what ?? solution.body}</p>
                </div>
              </Reveal>
            </div>
          )}

          {variant === "stack" && (
            <div className="max-w-3xl mx-auto">
              <Reveal delay={0.05}>
                <p className="mono-label text-accent-deep mb-5">The business challenge</p>
                <p className="display text-3xl sm:text-5xl text-ink leading-[1.1]">
                  {CHALLENGE[solution.id] ?? "Technology plans move faster than the teams available to deliver them."}
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="mt-12 border-l-2 border-brand/50 pl-7">
                  <p className="mono-label text-accent-deep mb-4">{d?.whatHeading ?? "Our solution"}</p>
                  <p className="text-lg text-ink/80 leading-relaxed">{d?.what ?? solution.body}</p>
                </div>
              </Reveal>
            </div>
          )}

          {variant === "mosaic" && (
            <div className="grid lg:grid-cols-12 gap-6">
              <Reveal delay={0.05} className="lg:col-span-7">
                <div className="h-full rounded-[28px] border border-line bg-paper p-8 sm:p-12">
                  <p className="mono-label text-accent-deep mb-5">The business challenge</p>
                  <p className="text-xl sm:text-2xl text-ink leading-relaxed">
                    {CHALLENGE[solution.id] ?? "Technology plans move faster than the teams available to deliver them."}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.14} className="lg:col-span-5">
                <div className={`relative h-full overflow-hidden rounded-[28px] ${PRISM_BG[accent]} p-8 sm:p-12`}>
                  <p className="mono-label text-white/70 mb-5">{d?.whatHeading ?? "Our solution"}</p>
                  <p className="text-lg text-white leading-relaxed">{d?.what ?? solution.body}</p>
                </div>
              </Reveal>
            </div>
          )}

          {variant === "rail" && (
            <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-16">
              <Reveal delay={0.05}>
                <div className="flex lg:flex-col items-center lg:items-start gap-4">
                  {/* The rail still needs a head to start from. It used to be
                      this page's position within its group, which told a reader
                      who landed here from search nothing at all. */}
                  <span aria-hidden className={`h-4 w-4 shrink-0 rounded-full ${PRISM_BG[accent]} ring-4 ring-brand/15`} />
                  <span aria-hidden className="hidden lg:block w-px flex-1 bg-gradient-to-b from-brand/60 to-transparent" />
                </div>
              </Reveal>
              <div>
                <Reveal delay={0.1}>
                  <p className="mono-label text-accent-deep mb-5">The business challenge</p>
                  <p className="display text-3xl sm:text-5xl text-ink max-w-3xl leading-[1.1]">
                    {CHALLENGE[solution.id] ?? "Technology plans move faster than the teams available to deliver them."}
                  </p>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="mt-10 max-w-3xl">
                    <p className="mono-label text-accent-deep mb-4">{d?.whatHeading ?? "Our solution"}</p>
                    <p className="text-lg text-ink/80 leading-relaxed">{d?.what ?? solution.body}</p>
                  </div>
                </Reveal>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---- Differentiators as a stacking deck ---- */}
      {d && (
        <StackedStory
          eyebrow={solution.name}
          heading={<>{d.capHeading.split(" ").slice(0, -1).join(" ")} <span className="text-brand italic">{d.capHeading.split(" ").slice(-1)}</span></>}
          accentClass={PRISM_BG[accent]}
          items={d.points}
        />
      )}

      {/* Capabilities */}
      <section className="relative z-10 bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="mb-14">
            <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-4">Capabilities</p></Reveal>
            <Reveal delay={0.12}>
              <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">
                What you get, <span className="text-brand italic">specifically.</span>
              </h2>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {solution.points.map((pt, i) => (
              <Reveal key={pt} delay={(i % 4) * 0.06}>
                <div className="card-lift group h-full bg-surface border border-line rounded-2xl p-7 hover:border-brand/50">
                  <span aria-hidden className={`block h-px w-10 ${PRISM_BG[i % 6]} mb-5 opacity-70`} />
                  <p className="text-ink leading-relaxed">{pt}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {models.length > 0 && (
            <>
              <Reveal className="mt-20 mb-8" delay={0.05}>
                <p className="mono-label text-accent-deep">Delivery models</p>
              </Reveal>
              <div className="flex flex-wrap gap-3">
                {models.map((m, i) => (
                  <Reveal key={m} delay={i * 0.06}>
                    <span className="inline-block mono-label text-graphite border border-line-blue rounded-full px-4 py-2 hover:border-brand/50 hover:text-brand transition-colors">
                      {m}
                    </span>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Proof strip */}
      <section className="relative z-10 bg-surface/70 py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line-blue border border-line-blue rounded-2xl overflow-hidden">
            {STAFFING_STATS.map((s, i) => (
              <Reveal key={s.label} delay={(i % 4) * 0.06} className="bg-paper p-7 sm:p-9">
                <CountUp value={s.value} className={`display text-4xl sm:text-5xl ${PRISM_TEXT[i % 6]}`} />
                <p className="mt-3 text-sm text-graphite leading-relaxed">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who we support */}
      <section className="relative z-10 bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="mb-14">
            <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-4">Who we support</p></Reveal>
            <Reveal delay={0.12}>
              <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">
                The industries this model fits <span className="text-brand italic">best.</span>
              </h2>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.slice(0, 6).map((ind, i) => (
              <Reveal key={ind.id} delay={(i % 3) * 0.06}>
                <Link href={`/industries#${ind.id}`} className="card-lift group block h-full bg-surface border border-line rounded-2xl p-7 hover:border-brand/50">
                  <h3 className="display text-2xl text-ink group-hover:text-brand transition-colors">{ind.name}</h3>
                  <p className="mt-2 text-sm text-accent-deep">{ind.line}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      {proof.length > 0 && (
        <section className="relative z-10 bg-surface/70 py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <Reveal className="mb-14" delay={0.05}>
              <p className="mono-label text-accent-deep mb-4">Proof &amp; case studies</p>
              <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">
                Delivered, not <span className="text-brand italic">promised.</span>
              </h2>
            </Reveal>
            <div className="grid lg:grid-cols-2 gap-5">
              {proof.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.08}>
                  <Link href="/company#case-studies" className="card-lift group block h-full bg-paper border border-line rounded-2xl p-7 hover:border-brand/50">
                    <p className={`mono-label ${PRISM_TEXT[i % 6]}`}>{c.industry}</p>
                    <h3 className="display text-2xl text-ink mt-3 group-hover:text-brand transition-colors">{c.title}</h3>
                    <p className="mt-3 text-sm text-ink/70 leading-relaxed">{c.outcome}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related solutions */}
      <section className="relative z-10 bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-10"><p className="mono-label text-accent-deep">Related solutions</p></Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((r, i) => (
              <Reveal key={r.id} delay={(i % 4) * 0.05}>
                <Link href={`/us-staffing/${r.id}`} className="card-lift group flex h-full flex-col bg-surface border border-line rounded-2xl p-6 hover:border-brand/50">
                  <h3 className="display text-xl text-ink group-hover:text-brand transition-colors">{r.name}</h3>
                  <p className="mt-2 mono-label text-accent-deep">{r.line}</p>
                  <p className="mt-4 text-sm text-ink/65 leading-relaxed flex-1">
                    {SOLUTION_DETAIL[r.id]?.lead ?? r.body}
                  </p>
                  <span className="mt-5 mono-label text-graphite group-hover:text-brand transition-colors">Explore →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Solutions"
        heading="Discuss your workforce requirements."
        body="Roles, skills, locations, engagement model and timeline — tell us what you need and we will map it to the right model."
        cta="Discuss Workforce Requirements"
      />
    </>
  );
}
