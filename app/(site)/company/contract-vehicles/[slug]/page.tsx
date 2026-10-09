import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import FactStrip from "@/components/FactStrip";
import { ALL_VEHICLES, getVehicle, type Vehicle } from "@/lib/contracts";
import { getImageBySlot } from "@/lib/site";
import { PRISM_TEXT, PRISM_VAR } from "@/lib/data";

/* ISR: rendered once and reused for a minute, so a click is not waiting
   on a database round trip. */
export const revalidate = 60;

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

  /* The official awarded-vendor mark lives in the database, so it can be
     swapped without a deploy. It is for the header only — the verify band below
     shows the awarding body's plain logo, because that panel is about who to
     check with, not about the award we hold. The bundled file is the fallback
     if the row is missing. */
  const slotSrc = v.imageSlot ? await getImageBySlot(v.imageSlot) : "";
  const mark = v.image ? { ...v.image, src: slotSrc || v.image.src } : undefined;

  const siblings = ALL_VEHICLES.filter((o) => o.id !== v.id);

  return (
    <div style={{ "--page-accent": PRISM_VAR[v.accent % 6] } as React.CSSProperties}>
      <PageHeader eyebrow={`${group.title} · Contract vehicle`} vanta={v.vanta} logo={mark} title={v.short} intro={v.lead} />

      <Breadcrumb group={group.title} name={v.name} />

      {/* The facts a procurement officer checks first, set as a record strip
          rather than as prose. */}
      <section className="relative z-10 bg-surface border-y border-line">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <FactStrip
            facts={[
              /* Never invent a number: buyers verify it with the awarding body
                 before citing it on a requisition. */
              { label: "Contract number", value: v.number ?? "Provided on request", mono: true },
              ...v.facts,
            ]}
          />
        </div>
      </section>

      {v.variant === "dossier" ? <Dossier v={v} /> : <Brief v={v} />}

      {/* What the vehicle actually buys from us. */}
      <section className="relative z-10 bg-surface py-16 sm:py-20 border-t border-line">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <div className="max-w-3xl mb-10">
            <p className="mono-label label-accent mb-4">Delivered under this vehicle</p>
            <h2 className="display text-3xl sm:text-5xl text-ink">
              What an order actually <span className="italic" style={{ color: "var(--page-accent)" }}>buys</span>
            </h2>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2">
            {v.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05} variant="tilt" duration={0.7}>
                <li className="group relative h-full overflow-hidden rounded-3xl border border-line bg-paper p-8 sm:p-10 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--card-accent)]/50 hover:shadow-card"
                    style={{ "--card-accent": PRISM_VAR[(v.accent + i) % 6] } as React.CSSProperties}>
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full ${PRISM_BG[(v.accent + i) % 6]} opacity-[0.10] blur-[90px] transition-opacity duration-500 group-hover:opacity-20`}
                  />
                  {/* The numeral carries the card's colour at low opacity. Set in
                      ink it read as a heading competing with the title. */}
                  <span className="display relative text-5xl leading-none opacity-30 transition-opacity duration-500 group-hover:opacity-70"
                        style={{ color: "var(--card-accent)" }}>
                    0{i + 1}
                  </span>
                  <h3 className="display relative text-2xl sm:text-3xl text-ink mt-4">{p.title}</h3>
                  <span
                    aria-hidden
                    className="prism-rule relative mt-4 block origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ background: "var(--card-accent)" }}
                  />
                  <p className="relative mt-4 text-ink/75 leading-relaxed">{p.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Footage band, edges dissolved into the surface so it reads as part of
          the page rather than a video dropped into a box. */}
      {v.band && (
        <section className="relative z-10 bg-surface pb-6 sm:pb-8">
          <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
            <Reveal variant="rise" duration={0.8}>
              <figure className="relative overflow-hidden rounded-[1.75rem] border border-line">
                <video
                  className="media-footage block w-full h-[clamp(12.5rem,28vw,23.75rem)] object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label={v.band.alt}
                >
                  <source src={v.band.src} type="video/mp4" />
                </video>
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-surface/35 to-transparent" />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left"
                  style={{ background: `linear-gradient(90deg, ${PRISM_VAR[v.accent % 6]}, transparent)` }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-7 sm:p-12">
                  <p className="display text-2xl sm:text-4xl text-ink max-w-2xl leading-[1.1]">{v.band.line}</p>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>
      )}

      {/* The awarding body's own site, so a buyer can verify us at the source
          rather than taking this page's word for it. */}
      {v.vendor && (
        <section className="relative z-10 bg-paper-tint/55 py-14 sm:py-18">
          <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-line-blue/60 bg-surface px-7 py-11 sm:px-14 sm:py-14">
                <span aria-hidden className={`pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full ${PRISM_BG[v.accent % 6]} opacity-[0.12] blur-[110px]`} />
                <div
                  className={
                    v.image
                      ? "relative grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16"
                      : "relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"
                  }
                >
                  <div className="max-w-2xl">
                    <p className="mono-label label-accent mb-4">Verify at the source</p>
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
                    /* The mark is mid-dark artwork on transparency, so it sits
                       on a light plate — the same treatment the partner logos
                       in the footer get, for the same reason. */
                    <div className="grid place-items-center rounded-2xl bg-white p-10 sm:p-14 ring-1 ring-black/5 lg:justify-self-end w-full max-w-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.image.src}
                        alt={v.image.alt}
                        loading="lazy"
                        decoding="async"
                        className="block w-full max-w-[13.75rem] h-auto"
                      />
                    </div>
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
      <section className="relative z-10 bg-paper py-14 sm:py-18 border-t border-line">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="mono-label label-accent mb-4">Other vehicles</p>
              <h2 className="display text-3xl sm:text-5xl text-ink">
                Not the one that covers <span className="italic" style={{ color: "var(--page-accent)" }}>you?</span>
              </h2>
            </div>
            <Link href="/company/contract-vehicles" className="mono-label label-accent hover:text-brand transition-colors">
              All contract vehicles →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((o, i) => (
              <Reveal key={o.id} delay={i * 0.05} variant="right">
                <Link
                  href={`/company/contract-vehicles/${o.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--sib-accent)]/50 hover:shadow-card"
                  style={{ "--sib-accent": PRISM_VAR[o.accent % 6] } as React.CSSProperties}
                >
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: "var(--sib-accent)" }} />
                  <span className={`mono-label ${PRISM_TEXT[o.accent % 6]}`}>{o.authority.split("·")[0].trim()}</span>
                  <span className="display text-xl text-ink mt-3 transition-colors group-hover:text-[var(--sib-accent)]">{o.short}</span>
                  <span className="mt-3 text-sm text-graphite leading-relaxed">{o.summary}</span>
                  <span aria-hidden className="mono-label mt-5 inline-flex items-center gap-2 opacity-0 transition-opacity duration-400 group-hover:opacity-100" style={{ color: "var(--sib-accent)" }}>
                    Open <span className="arrow-flow">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow={v.name}
        heading="Check whether this vehicle covers you."
        body="Tell us which agency you buy for and we will confirm your eligibility, the published rates for the roles you need, and how quickly an order becomes a working team."
        cta="Talk to Public Sector"
      />
    </div>
  );
}

function Breadcrumb({ group, name }: { group: string; name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="relative z-10 bg-paper">
      <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 pb-10">
        <ol className="flex flex-wrap items-center gap-2 mono-label text-graphite">
          <li><Link href="/company" className="hover:text-brand transition-colors">Who We Are</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/company/contract-vehicles" className="hover:text-brand transition-colors">Contract Vehicles</Link></li>
          <li aria-hidden>/</li>
          <li className="label-accent">{group}</li>
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
    <section className="relative z-10 bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 grid lg:grid-cols-[1.25fr_0.75fr] gap-12 lg:gap-20">
        <div>
          <p className="mono-label label-accent mb-6">How it works</p>
          {v.body.map((para, i) => (
            <Reveal key={i} delay={i * 0.05}>
              {/* One size for the whole passage. The first paragraph used to be set
                  larger as a lead-in, which made the four read as a pull quote
                  followed by small print rather than as one argument. */}
              <p className={`text-lg text-ink/80 leading-[1.85] ${i === 0 ? "" : "mt-6"}`}>{para}</p>
            </Reveal>
          ))}
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start space-y-5">
          {/* A picture of the setting the contract belongs to. A logo lockup
              sat here first and read as though we had awarded ourselves the
              contract, however the labels were worded. */}
          {v.photo && <SettingPhoto v={v} />}

          <Panel title="Who can buy" accent={v.accent}>
            <p className="text-ink/75 leading-relaxed">{v.eligibility}</p>
          </Panel>
          <Panel title="In scope" accent={v.accent + 2}>
            <ul className="space-y-3">
              {v.scope.map((s) => (
                <li key={s} className="flex gap-3 text-ink/75 leading-relaxed">
                  <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 transition-all duration-300 group-hover:w-6" style={{ background: PRISM_VAR[v.accent % 6] }} />
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
    <section className="relative z-10 bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-5 mb-10">
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
                    <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 transition-all duration-300 group-hover:w-6" style={{ background: PRISM_VAR[v.accent % 6] }} />
                    {s}
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>
        </div>

        {/* The left column used to hold a two-word label and nothing else, so
            the setting photo lives in it rather than adding a band of its own. */}
        <div className="grid lg:grid-cols-[0.34fr_0.66fr] gap-8 lg:gap-14 border-t border-line pt-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mono-label label-accent">How it works</p>
            {v.photo && (
              <div className="mt-6">
                <SettingPhoto v={v} />
              </div>
            )}
          </div>
          <div className="max-w-3xl">
            {v.body.map((para, i) => (
              <Reveal key={i} delay={i * 0.05}>
                {/* One size for the whole passage. The first paragraph used to be set
                  larger as a lead-in, which made the four read as a pull quote
                  followed by small print rather than as one argument. */}
              <p className={`text-lg text-ink/80 leading-[1.85] ${i === 0 ? "" : "mt-6"}`}>{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The setting the contract belongs to. The image is held slightly larger than
 * its frame and drifts, so it reads as a window onto a place rather than a
 * picture pasted into a card — the note the vision page got.
 */
function SettingPhoto({ v }: { v: Vehicle }) {
  if (!v.photo) return null;
  return (
    <Reveal variant="rise" duration={0.75}>
      <figure className="group relative overflow-hidden rounded-2xl border border-line">
        <span
          aria-hidden
          className={`pointer-events-none absolute -left-10 -top-10 z-10 h-40 w-40 rounded-full ${PRISM_BG[v.accent % 6]} opacity-20 blur-[70px]`}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={v.photo.src}
          alt={v.photo.alt}
          loading="lazy"
          decoding="async"
          className="media-footage anim-drift block aspect-[16/10] w-full scale-[1.08] object-cover transition-transform duration-[1.2s] group-hover:scale-[1.14]"
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left"
          style={{ background: `linear-gradient(90deg, ${PRISM_VAR[v.accent % 6]}, transparent)` }}
        />
        <figcaption className="absolute inset-x-0 bottom-0 p-6">
          <p className="mono-label label-accent">{v.photo.caption}</p>
          {v.number && <p className="mt-2 font-mono text-sm text-ink">{v.number}</p>}
        </figcaption>
      </figure>
    </Reveal>
  );
}

function Panel({ title, accent, children }: { title: string; accent: number; children: React.ReactNode }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-8 transition-colors duration-500 hover:border-[var(--panel-accent)]/45"
         style={{ "--panel-accent": PRISM_VAR[accent % 6] } as React.CSSProperties}>
      <span aria-hidden className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full ${PRISM_BG[accent % 6]} anim-drift opacity-[0.10] blur-[80px]`} />
      {/* A hairline in the panel's own colour, so the two panels read as a pair
          of distinct records rather than two identical grey boxes. */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left" style={{ background: "linear-gradient(90deg, var(--panel-accent), transparent)" }} />
      <p className="mono-label relative" style={{ color: "var(--panel-accent)" }}>{title}</p>
      <div className="relative mt-5">{children}</div>
    </div>
  );
}
