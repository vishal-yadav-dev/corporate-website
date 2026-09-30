import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import VehicleLedger from "@/components/VehicleLedger";
import ProcurementRail from "@/components/ProcurementRail";
import { VEHICLE_GROUPS, BUY_STEPS, CERTIFICATIONS } from "@/lib/contracts";
import { PRISM_TEXT } from "@/lib/data";

/* ISR: rendered once and reused for a minute, so a click is not waiting
   on a database round trip. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Government Contract Vehicles",
  description:
    "Public agencies can buy Testsoft services through TIPS, Texas DIR, GSA and other pre-competed contract vehicles — no new solicitation required.",
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

      {/* TIPS carries most of the public sector volume, so it is set apart from
          the ledger rather than filed inside it. */}
      <section className="relative z-10 bg-paper-tint/55 pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal variant="blur" duration={0.8}>
            <Link
              href="/company/contract-vehicles/tips"
              className="group block relative overflow-hidden rounded-[28px] border border-line-blue/60 bg-surface px-7 py-12 sm:px-14 sm:py-16 transition-colors hover:border-brand/50"
            >
              <span aria-hidden className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-brand/12 blur-[120px]" />
              <div className="relative grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
                <div>
                  <p className="mono-label text-accent-deep mb-4">Primary cooperative</p>
                  <h2 className="display text-4xl sm:text-6xl text-ink leading-[0.98] group-hover:text-brand transition-colors">
                    TIPS
                  </h2>
                  <p className="mt-4 text-accent-deep text-lg">The Interlocal Purchasing System</p>
                  <p className="mono-label text-graphite mt-8 leading-relaxed">
                    Region 8 Education Service Center
                    <br />
                    Pittsburg, Texas
                  </p>
                </div>
                <div className="lg:pt-14">
                  <p className="text-lg text-ink/80 leading-relaxed">
                    TIPS is a national purchasing cooperative that gives its members access to
                    contracts it has already competed on their behalf. It is housed at and managed by
                    the Region 8 Education Service Center in Pittsburg, Texas.
                  </p>
                  <p className="mt-6 text-graphite leading-relaxed">
                    For a member agency that means our rates, terms and scope are settled before the
                    conversation begins. A district, a city or a university can move from a decision
                    to an issued order without drafting an RFP, convening an evaluation committee or
                    waiting out a protest window. Membership is free, and an agency can join at any
                    point before it issues the order.
                  </p>
                  <span className="mono-label text-accent-deep mt-8 inline-flex items-center gap-2 group-hover:text-brand transition-colors">
                    Read the TIPS vehicle
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>

                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      <VehicleLedger groups={VEHICLE_GROUPS} />

      <ProcurementRail
        eyebrow="How to buy"
        heading={<>From interest to kickoff, <span className="text-brand italic">in five steps</span></>}
        intro="Nothing here is unusual for a public buyer, but the order matters and the first step is the one agencies most often skip."
        steps={BUY_STEPS}
      />

      {/* Certifications are the second thing a procurement officer checks, after
          the vehicle itself. */}
      <section className="relative z-10 bg-paper py-20 sm:py-28 border-t border-line">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
            <div>
              <p className="mono-label text-accent-deep mb-4">Certifications</p>
              <h2 className="display text-3xl sm:text-5xl text-ink">
                Status that counts toward your goals
              </h2>
            </div>
            <ul className="grid sm:grid-cols-3 gap-6">
              {CERTIFICATIONS.map((c, i) => (
                <Reveal key={c.label} delay={i * 0.06} variant="zoom">
                  <li className="h-full rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-brand/50">
                    <p className={`display text-4xl ${PRISM_TEXT[i % 6]}`}>{c.label}</p>
                    <p className="mt-4 text-graphite leading-relaxed">{c.body}</p>
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
