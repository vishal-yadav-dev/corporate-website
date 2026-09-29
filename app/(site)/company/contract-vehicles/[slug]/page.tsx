import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import Float3D from "@/components/Float3D";
import { ALL_VEHICLES, getVehicle, type Vehicle } from "@/lib/contracts";
import { PRISM_TEXT } from "@/lib/data";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

export async function generateStaticParams() {
  return ALL_VEHICLES.map((v) => ({ slug: v.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const found = getVehicle(slug);
  if (!found) return { title: "Contract Vehicle" };
  return { title: found.vehicle.name, description: found.vehicle.lead.slice(0, 155) };
}

export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getVehicle(slug);
  if (!found) notFound();
  const { vehicle: v, group } = found;

  const siblings = ALL_VEHICLES.filter((o) => o.id !== v.id);

  return (
    <>
      <PageHeader eyebrow={`${group.title} · Contract vehicle`} vanta={v.vanta} title={v.short} intro={v.lead} />

      <Breadcrumb group={group.title} name={v.name} />

      {/* The facts a procurement officer checks first, set as a record strip
          rather than as prose. */}
      <section className="relative z-10 bg-surface border-y border-line">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <dl className="grid sm:grid-cols-2 lg:grid-cols-5 divide-y divide-line lg:divide-y-0 lg:divide-x lg:divide-line">
            <div className="py-8 lg:pr-8">
              <dt className="mono-label text-accent-deep">Contract number</dt>
              {/* Never invent one: buyers verify the number with the awarding
                  body before citing it on a requisition. */}
              <dd className="mt-3 font-mono text-sm text-ink">{v.number ?? "Provided on request"}</dd>
            </div>
            {v.facts.map((f) => (
              <div key={f.label} className="py-8 lg:px-8 last:lg:pr-0">
                <dt className="mono-label text-accent-deep">{f.label}</dt>
                <dd className="mt-3 text-sm text-ink/80 leading-relaxed">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {v.variant === "dossier" ? <Dossier v={v} /> : <Brief v={v} />}

      {/* What the vehicle actually buys from us. */}
      <section className="relative z-10 bg-surface py-24 sm:py-32 border-t border-line">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="max-w-3xl mb-14">
            <p className="mono-label text-accent-deep mb-4">Delivered under this vehicle</p>
            <h2 className="display text-3xl sm:text-5xl text-ink">
              What an order actually <span className="text-brand italic">buys</span>
            </h2>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2">
            {v.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <li className="group relative h-full overflow-hidden rounded-3xl border border-line bg-paper p-8 sm:p-10 transition-colors hover:border-brand/50">
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full ${PRISM_BG[(v.accent + i) % 6]} opacity-[0.10] blur-[90px] transition-opacity duration-500 group-hover:opacity-20`}
                  />
                  <span className="display relative text-5xl text-ink/12 leading-none">0{i + 1}</span>
                  <h3 className="display relative text-2xl sm:text-3xl text-ink mt-4">{p.title}</h3>
                  <p className="relative mt-4 text-ink/75 leading-relaxed">{p.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* The awarding body's own site, so a buyer can verify us at the source
          rather than taking this page's word for it. */}
      {v.vendor && (
        <section className="relative z-10 bg-paper-tint/55 py-20 sm:py-28">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-[28px] border border-line-blue/60 bg-surface px-7 py-11 sm:px-14 sm:py-14">
                <span aria-hidden className={`pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full ${PRISM_BG[v.accent % 6]} opacity-[0.12] blur-[110px]`} />
                <div
                  className={
                    v.image
                      ? "relative grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16"
                      : "relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"
                  }
                >
                  <div className="max-w-2xl">
                    <p className="mono-label text-accent-deep mb-4">Verify at the source</p>
                    <h2 className="display text-2xl sm:text-4xl text-ink">{v.authority}</h2>
                    <p className="mt-4 text-graphite leading-relaxed">{v.vendor.note}</p>
                    {v.image && (
                      <a
                        href={v.vendor.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-8 inline-flex items-center gap-3 rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-colors hover:bg-brand-deep"
                      >
                        {v.vendor.label}
                        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
                      </a>
                    )}
                  </div>
                  {v.image ? (
                    <Float3D src={v.image.src} alt={v.image.alt} className="lg:justify-self-end w-full max-w-md" />
                  ) : (
                    <a
                      href={v.vendor.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-colors hover:bg-brand-deep"
                    >
                      {v.vendor.label}
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Buyers rarely arrive knowing which vehicle applies to them, so every
          page offers the others. */}
      <section className="relative z-10 bg-paper py-20 sm:py-28 border-t border-line">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="mono-label text-accent-deep mb-4">Other vehicles</p>
              <h2 className="display text-3xl sm:text-5xl text-ink">
                Not the one that covers <span className="text-brand italic">you?</span>
              </h2>
            </div>
            <Link href="/company/contract-vehicles" className="mono-label text-accent-deep hover:text-brand transition-colors">
              All contract vehicles →
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((o, i) => (
              <li key={o.id}>
                <Link
                  href={`/company/contract-vehicles/${o.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-brand/50"
                >
                  <span className={`mono-label ${PRISM_TEXT[i % 6]}`}>{o.authority.split("·")[0].trim()}</span>
                  <span className="display text-xl text-ink mt-3 group-hover:text-brand transition-colors">{o.short}</span>
                  <span className="mt-3 text-sm text-graphite leading-relaxed">{o.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner
        eyebrow={v.name}
        heading="Check whether this vehicle covers you."
        body="Tell us which agency you buy for and we will confirm your eligibility, the published rates for the roles you need, and how quickly an order becomes a working team."
        cta="Talk to Public Sector"
      />
    </>
  );
}

function Breadcrumb({ group, name }: { group: string; name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="relative z-10 bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pb-10">
        <ol className="flex flex-wrap items-center gap-2 mono-label text-graphite">
          <li><Link href="/company" className="hover:text-brand transition-colors">Company</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/company/contract-vehicles" className="hover:text-brand transition-colors">Contract Vehicles</Link></li>
          <li aria-hidden>/</li>
          <li className="text-accent-deep">{group}</li>
          <li aria-hidden>/</li>
          <li className="text-ink">{name}</li>
        </ol>
      </div>
    </nav>
  );
}

/**
 * Dossier: the prose runs in a single wide column with eligibility and scope
 * held beside it in a sticky rail, the way a contract summary sheet reads.
 */
function Dossier({ v }: { v: Vehicle }) {
  return (
    <section className="relative z-10 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 grid lg:grid-cols-[1.25fr_0.75fr] gap-12 lg:gap-20">
        <div>
          <p className="mono-label text-accent-deep mb-6">How it works</p>
          {v.body.map((para, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className={`text-ink/80 leading-[1.85] ${i === 0 ? "text-xl sm:text-2xl text-ink" : "mt-7"}`}>{para}</p>
            </Reveal>
          ))}
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start space-y-5">
          <Panel title="Who can buy" accent={v.accent}>
            <p className="text-ink/75 leading-relaxed">{v.eligibility}</p>
          </Panel>
          <Panel title="In scope" accent={v.accent + 2}>
            <ul className="space-y-3">
              {v.scope.map((s) => (
                <li key={s} className="flex gap-3 text-ink/75 leading-relaxed">
                  <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-brand/60" />
                  {s}
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </section>
  );
}

/**
 * Brief: the same material turned ninety degrees. Eligibility and scope run
 * full width across the top as a banded header, and the prose sits underneath
 * at a narrower measure.
 */
function Brief({ v }: { v: Vehicle }) {
  return (
    <section className="relative z-10 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          <Reveal>
            <Panel title="Who can buy" accent={v.accent}>
              <p className="text-ink/75 leading-relaxed">{v.eligibility}</p>
            </Panel>
          </Reveal>
          <Reveal delay={0.06}>
            <Panel title="In scope" accent={v.accent + 2}>
              <ul className="space-y-3">
                {v.scope.map((s) => (
                  <li key={s} className="flex gap-3 text-ink/75 leading-relaxed">
                    <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-brand/60" />
                    {s}
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-[0.3fr_0.7fr] gap-8 lg:gap-16 border-t border-line pt-14">
          <p className="mono-label text-accent-deep">How it works</p>
          <div className="max-w-3xl">
            {v.body.map((para, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className={`text-ink/80 leading-[1.85] ${i === 0 ? "text-xl sm:text-2xl text-ink" : "mt-7"}`}>{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ title, accent, children }: { title: string; accent: number; children: React.ReactNode }) {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-8">
      <span aria-hidden className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full ${PRISM_BG[accent % 6]} opacity-[0.10] blur-[80px]`} />
      <p className="mono-label text-accent-deep relative">{title}</p>
      <div className="relative mt-5">{children}</div>
    </div>
  );
}
