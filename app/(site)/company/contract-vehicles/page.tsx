import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import ProcurementRail from "@/components/ProcurementRail";
import LinkPending from "@/components/LinkPending";
import DataFlow from "@/components/DataFlow";
import { VEHICLE_GROUPS, BUY_STEPS, CERTIFICATIONS } from "@/lib/contracts";
import { PRISM_TEXT } from "@/lib/data";

/* ISR: rendered once and reused for a minute, so a click is not waiting
   on a database round trip. */
export const revalidate = 60;

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

export const metadata: Metadata = {
  title: "Government Contract Vehicles",
  description:
    "Public agencies can buy Testsoft services through TIPS and the Florida DMS state term contract, already competed, so no new solicitation is required.",
};

export default function ContractVehiclesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Government Contract Vehicles"
        video="tips"
        title="Procurement paths already open"
        intro="Public agencies can reach us through cooperative and state contracts that have already been competed. The solicitation cycle is done, the rates are published, and the work can start on a purchase order."
      />

      {/* Both vehicles, one treatment. TIPS used to get a feature card above a
          ledger it also appeared in, so the two read as a headline act and a
          footnote. They are two ways to buy the same work. */}
      <section className="relative z-10 overflow-hidden bg-paper-tint/55 pt-14 sm:pt-20 pb-14 sm:pb-20">
        <DataFlow density={0.7} />
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-paper-tint/70" />
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-paper to-transparent" />
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-paper to-transparent" />

        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-10 max-w-3xl">
            <p className="mono-label label-accent mb-4">The vehicles</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Two ways to buy, both already <span className="text-brand italic">competed.</span>
            </h2>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-2">
            {VEHICLE_GROUPS.flatMap((g) => g.vehicles.map((v) => ({ v, g }))).map(({ v, g }, i) => (
              <Reveal key={v.id} delay={i * 0.08} variant={i ? "left" : "right"} duration={0.75}>
                <Link
                  href={`/company/contract-vehicles/${v.id}`}
                  className="card-lift group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface p-8 sm:p-11 transition-colors hover:border-brand/50"
                >
                  <span
                    aria-hidden
                    className={`prism-wash-lg pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full ${PRISM_BG[i % 6]} blur-[110px] transition-opacity duration-500 group-hover:opacity-50`}
                  />
                  <span
                    aria-hidden
                    className={`prism-rule relative block ${PRISM_BG[i % 6]} origin-left transition-transform duration-500 group-hover:scale-x-[1.8]`}
                  />
                  <span className={`relative mono-label mt-6 ${PRISM_TEXT[i % 6]}`}>{g.title}</span>
                  <span className="relative mono-label text-graphite mt-2">{v.authority}</span>
                  <h3 className="relative display text-2xl sm:text-4xl text-ink mt-4 leading-[1.1] group-hover:text-brand transition-colors">
                    {v.name}
                  </h3>
                  <p className="relative mt-5 text-graphite leading-relaxed flex-1">{v.summary}</p>

                  <span className="relative mt-7 block border-t border-line pt-5">
                    <span className="mono-label label-accent">Contract number</span>
                    <span className="mt-2 block font-mono text-sm text-ink">
                      {v.number ?? "Provided on request"}
                    </span>
                  </span>

                  <span className="relative mt-6 inline-flex items-center gap-2 mono-label label-accent group-hover:text-brand transition-colors">
                    Read the vehicle
                    <LinkPending />
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ProcurementRail
        eyebrow="How to buy"
        heading={<>From interest to kickoff, <span className="text-brand italic">in five steps</span></>}
        intro="Nothing here is unusual for a public buyer, but the order matters and the first step is the one agencies most often skip."
        steps={BUY_STEPS}
      />

      {/* Certifications are the second thing a procurement officer checks, after
          the vehicle itself. */}
      <section className="relative z-10 overflow-hidden bg-paper py-12 sm:py-16 border-t border-line">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
            <div>
              <p className="mono-label label-accent mb-4">Certifications</p>
              <h2 className="display text-3xl sm:text-5xl text-ink">
                Status that counts toward your goals
              </h2>
            </div>
            <ul className="grid sm:grid-cols-3 gap-6">
              {CERTIFICATIONS.map((c, i) => (
                <Reveal key={c.label} delay={i * 0.06} variant="zoom">
                  <li className="card-lift group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-brand/50">
                    <span aria-hidden className={`prism-wash pointer-events-none absolute -left-14 -bottom-14 h-40 w-40 rounded-full ${PRISM_BG[(i + 2) % 6]} blur-[70px] transition-opacity duration-500 group-hover:opacity-45`} />
                    <p className={`display relative text-4xl ${PRISM_TEXT[i % 6]}`}>{c.label}</p>
                    <p className="relative mt-4 text-graphite leading-relaxed">{c.body}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Government Contract Vehicles"
        heading="Tell us which agency you buy for."
        body="We will confirm which vehicle covers you, what the published rates are for the roles you need, and how quickly an order can be turned into a team."
        cta="Talk to Public Sector"
      />
    </>
  );
}
