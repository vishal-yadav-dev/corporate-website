import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import CtaBanner from "@/components/CtaBanner";
import HorizontalStory from "@/components/HorizontalStory";
import { getPractices, getStaffing, getCaseStudies } from "@/lib/site";
import { INDUSTRIES, PRISM_TEXT } from "@/lib/data";
import { INDUSTRY_DETAIL } from "@/lib/detail";

export const revalidate = 60;

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

/** Practices that matter most to each industry. */
const PRACTICES_FOR: Record<string, string[]> = {
  sled: ["salesforce", "cloud-devops", "data-analytics", "quality-engineering"],
  manufacturing: ["infor", "sap", "enterprise-integration", "data-analytics"],
  utilities: ["salesforce", "mulesoft", "data-analytics", "quality-engineering"],
  "higher-education": ["salesforce", "workday", "api-integration", "data-analytics"],
  enterprise: ["oracle", "cloud-devops", "ai-automation", "enterprise-integration"],
};

export async function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRIES.find((i) => i.id === slug);
  if (!industry) return { title: "Industry" };
  return { title: industry.name, description: (INDUSTRY_DETAIL[slug]?.lead ?? industry.body).slice(0, 155) };
}

function accentLast(text: string) {
  const w = text.trim().split(/\s+/);
  if (w.length < 2) return text;
  const last = w.pop();
  return (<>{w.join(" ")} <span className="text-brand italic">{last}</span></>);
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = INDUSTRIES.find((i) => i.id === slug);
  if (!industry) notFound();

  const d = INDUSTRY_DETAIL[slug];
  const accent = d?.accent ?? 1;
  const variant = d?.variant ?? "split";

  const [allPractices, solutions, cases] = await Promise.all([getPractices(), getStaffing(), getCaseStudies()]);
  const practices = (PRACTICES_FOR[slug] ?? [])
    .map((id) => allPractices.find((p) => p.id === id))
    .filter(Boolean) as typeof allPractices;
  const proof = cases.filter((c) => c.industry.toLowerCase() === industry.name.toLowerCase());
  const others = INDUSTRIES.filter((i) => i.id !== slug);
  const workforce = solutions.filter((s) => s.group === "workforce").slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Industries"
        video={d?.video}
        vanta={d?.vanta}
        art={d?.art}
        title={d?.headline ?? `${industry.name}.`}
        intro={d?.lead ?? industry.body}
      />

      {/* ---- Opening ---- */}
      <section className="relative z-10 bg-surface/70 pt-16 sm:pt-24 pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          {variant === "rail" ? (
            <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-16">
              <Reveal delay={0.05}>
                <div className="flex lg:flex-col items-center lg:items-start gap-4">
                  <span className={`h-14 w-14 grid place-items-center rounded-full ${PRISM_BG[accent]} text-white display text-lg`}>
                    {industry.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span aria-hidden className="hidden lg:block w-px flex-1 bg-gradient-to-b from-brand/60 to-transparent" />
                </div>
              </Reveal>
              <div>
                <Reveal delay={0.1}><p className="mono-label text-accent-deep mb-4">{d?.whatHeading}</p></Reveal>
                <Reveal delay={0.16}>
                  <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">{accentLast(industry.line)}</h2>
                </Reveal>
                <Reveal delay={0.24}>
                  <p className="mt-8 max-w-3xl text-xl text-ink/80 leading-relaxed">{d?.what}</p>
                </Reveal>
              </div>
            </div>
          ) : variant === "stack" ? (
            <div className="max-w-3xl mx-auto text-center">
              <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-5">{d?.whatHeading}</p></Reveal>
              <Reveal delay={0.12}>
                <h2 className="display text-4xl sm:text-6xl text-ink">{accentLast(industry.line)}</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-8 text-xl text-ink/80 leading-relaxed">{d?.what}</p>
              </Reveal>
            </div>
          ) : variant === "mosaic" ? (
            <div className="grid lg:grid-cols-12 gap-6">
              <Reveal delay={0.05} className="lg:col-span-5">
                <div className={`relative h-full overflow-hidden rounded-[28px] ${PRISM_BG[accent]} p-8 sm:p-12`}>
                  <p className="mono-label text-white/70 mb-5">{d?.whatHeading}</p>
                  <h2 className="display text-3xl sm:text-4xl text-white">{industry.line}</h2>
                </div>
              </Reveal>
              <Reveal delay={0.14} className="lg:col-span-7">
                <div className="h-full rounded-[28px] border border-line bg-paper p-8 sm:p-12 flex items-center">
                  <p className="text-lg sm:text-xl text-ink/80 leading-relaxed">{d?.what}</p>
                </div>
              </Reveal>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 items-start">
              <div className="lg:sticky lg:top-28">
                <Reveal delay={0.05}><p className="mono-label text-accent-deep mb-4">{d?.whatHeading}</p></Reveal>
                <Reveal delay={0.12}>
                  <h2 className="display text-4xl sm:text-6xl text-ink">{accentLast(industry.line)}</h2>
                </Reveal>
              </div>
              <Reveal delay={0.18}>
                <p className="text-xl sm:text-2xl text-ink/80 leading-relaxed">{d?.what}</p>
              </Reveal>
            </div>
          )}

          {/* Proof strip */}
          {d?.stats && (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-line-blue border border-line-blue rounded-2xl overflow-hidden">
              {d.stats.map((st, i) => (
                <Reveal key={st.label} delay={i * 0.07} className="bg-paper p-7 sm:p-9">
                  <CountUp value={st.value} className={`display text-4xl sm:text-5xl ${PRISM_TEXT[(accent + i) % 6]}`} />
                  <p className="mt-3 text-sm text-graphite leading-relaxed">{st.label}</p>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---- Capabilities travelling sideways ---- */}
      {d && (
        <HorizontalStory
          eyebrow={industry.name}
          heading={accentLast(d.capHeading)}
          accentClass={PRISM_BG[accent]}
          items={d.points}
        />
      )}

      {/* ---- Industry capability chips ---- */}
      <section className="relative z-10 bg-surface/70 py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-10" delay={0.05}>
            <p className="mono-label text-accent-deep mb-4">Capability areas</p>
            <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">
              What we bring to <span className="text-brand italic">{industry.name}.</span>
            </h2>
          </Reveal>
          <div className="flex flex-wrap gap-3 max-w-4xl">
            {industry.capabilities.map((c, i) => (
              <Reveal key={c} delay={i * 0.05}>
                <span className="inline-block mono-label text-graphite border border-line-blue rounded-full px-4 py-2 hover:border-brand/50 hover:text-brand transition-colors">
                  {c}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Related practices ---- */}
      {practices.length > 0 && (
        <section className="relative z-10 bg-paper py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <Reveal className="mb-14" delay={0.05}>
              <p className="mono-label text-accent-deep mb-4">Related practices</p>
              <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">
                The platforms this sector actually <span className="text-brand italic">runs.</span>
              </h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {practices.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 0.06}>
                  <Link href={`/practices/${p.id}`} className="card-lift group flex h-full flex-col bg-surface border border-line rounded-2xl p-7 hover:border-brand/50">
                    <h3 className="display text-xl text-ink group-hover:text-brand transition-colors">{p.name}</h3>
                    <p className="mt-2 mono-label text-accent-deep">{p.tag}</p>
                    <p className="mt-4 text-sm text-ink/65 leading-relaxed flex-1">{p.body}</p>
                    <span className="mt-5 mono-label text-graphite group-hover:text-brand transition-colors">Explore →</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Workforce ---- */}
      <section className="relative z-10 bg-surface/70 py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-14" delay={0.05}>
            <p className="mono-label text-accent-deep mb-4">Workforce</p>
            <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">
              And the people to <span className="text-brand italic">deliver it.</span>
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-5">
            {workforce.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 0.06}>
                <Link href={`/us-staffing/${s.id}`} className="card-lift group flex h-full flex-col bg-paper border border-line rounded-2xl p-7 hover:border-brand/50">
                  <span className={`mono-label ${PRISM_TEXT[(accent + i) % 6]}`}>0{i + 1}</span>
                  <h3 className="display text-2xl text-ink mt-4 group-hover:text-brand transition-colors">{s.name}</h3>
                  <p className="mt-3 text-sm text-ink/70 leading-relaxed flex-1">{s.line}</p>
                  <span className="mt-5 mono-label text-graphite group-hover:text-brand transition-colors">Explore →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Proof ---- */}
      {proof.length > 0 && (
        <section className="relative z-10 bg-paper py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <Reveal className="mb-14" delay={0.05}>
              <p className="mono-label text-accent-deep mb-4">Case studies</p>
              <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl">
                Work in this <span className="text-brand italic">sector.</span>
              </h2>
            </Reveal>
            <div className="grid lg:grid-cols-2 gap-5">
              {proof.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.08}>
                  <Link href="/company#case-studies" className="card-lift group block h-full bg-surface border border-line rounded-2xl p-7 hover:border-brand/50">
                    <p className={`mono-label ${PRISM_TEXT[(accent + i) % 6]}`}>{c.industry}</p>
                    <h3 className="display text-2xl text-ink mt-3 group-hover:text-brand transition-colors">{c.title}</h3>
                    <p className="mt-3 text-sm text-ink/70 leading-relaxed">{c.outcome}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Other industries ---- */}
      <section className="relative z-10 bg-surface/70 py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-10"><p className="mono-label text-accent-deep">Other industries</p></Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {others.map((o, i) => (
              <Reveal key={o.id} delay={(i % 4) * 0.05}>
                <Link href={`/industries/${o.id}`} className="card-lift group relative block h-full overflow-hidden bg-paper border border-line rounded-2xl p-6 hover:border-brand/50">
                  <span aria-hidden className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full ${PRISM_BG[(accent + i) % 6]} opacity-[0.12] blur-[70px] group-hover:opacity-25 transition-opacity duration-500`} />
                  <h3 className="relative display text-xl text-ink group-hover:text-brand transition-colors">{o.name}</h3>
                  <p className="relative mt-2 text-sm text-accent-deep">{o.line}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow={industry.name}
        heading="Discuss your industry technology initiative."
        body="Tell us the constraint you are working within — regulatory, operational or budgetary — and we will start from there rather than from a platform."
      />
    </>
  );
}
