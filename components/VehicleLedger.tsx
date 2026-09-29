import Link from "next/link";
import type { VehicleGroup } from "@/lib/contracts";

/**
 * The vehicles themselves, set as a ledger rather than as cards.
 *
 * A procurement officer reads this page to find the contract they can order
 * against, so the layout is a document: hairline rules, the awarding body in a
 * fixed column, and each row opening its own page where the eligibility, scope
 * and the awarding body's own link live in full.
 */
export default function VehicleLedger({ groups }: { groups: VehicleGroup[] }) {
  return (
    <section className="relative z-10 bg-paper pt-16 sm:pt-24 pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {groups.map((group, gi) => (
          <div key={group.id} id={group.id} className="scroll-mt-28 mb-20 sm:mb-28 last:mb-0">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 lg:gap-16 border-b border-line pb-10">
              <div>
                <span className="mono-label text-accent-deep">{`0${gi + 1} / Vehicles`}</span>
                <h2 className="display text-3xl sm:text-5xl text-ink mt-4">{group.title}</h2>
              </div>
              <p className="text-graphite leading-relaxed lg:pt-10">{group.note}</p>
            </div>

            <ul>
              {group.vehicles.map((v) => (
                <li key={v.id} className="border-b border-line">
                  <Link
                    href={`/company/contract-vehicles/${v.id}`}
                    className="group flex items-start gap-5 py-7 sm:py-9 transition-colors hover:bg-surface/60"
                  >
                    <span className="flex-1">
                      <span className="mono-label text-graphite">{v.authority}</span>
                      <span className="display block text-xl sm:text-3xl text-ink mt-2 group-hover:text-brand transition-colors">
                        {v.name}
                      </span>
                      <span className="mt-2 block max-w-2xl text-graphite leading-relaxed">{v.summary}</span>
                      <span className="mono-label text-accent-deep mt-4 inline-block">
                        Contract # {/* Never invent one: buyers verify the number with the
                                       awarding body before citing it on a requisition. */}
                        {v.number ?? "provided on request"}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="mt-3 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-blue text-accent-deep transition-all duration-300 group-hover:border-brand/50 group-hover:text-brand group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
