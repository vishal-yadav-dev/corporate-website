import type { VehicleGroup } from "@/lib/contracts";

/**
 * The vehicles themselves, set as a ledger rather than as cards.
 *
 * A procurement officer reads this page to check one thing — whether they can
 * buy through us and under what number — so the layout is a document: hairline
 * rules, a fixed column for the authority, and detail that opens in place.
 *
 * Built on native <details>, so every row is expandable, findable by the
 * browser's own in-page search, and costs no JavaScript at all.
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
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-start gap-5 py-7 sm:py-9 transition-colors hover:bg-surface/60 [&::-webkit-details-marker]:hidden">
                      <span className="flex-1">
                        <span className="mono-label text-graphite">{v.authority}</span>
                        <span className="display block text-xl sm:text-3xl text-ink mt-2 group-hover:text-brand transition-colors">
                          {v.name}
                        </span>
                        <span className="mt-2 block max-w-2xl text-graphite leading-relaxed">{v.summary}</span>
                      </span>
                      {/* A plus that becomes a minus. Two rules, one rotated. */}
                      <span aria-hidden className="relative mt-3 h-7 w-7 shrink-0 rounded-full border border-line-blue transition-colors group-hover:border-brand/50 group-open:border-brand/50">
                        <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-accent-deep" />
                        <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 rotate-90 bg-accent-deep transition-transform duration-300 group-open:rotate-0" />
                      </span>
                    </summary>

                    <div className="grid gap-8 pb-10 sm:grid-cols-[0.9fr_1.1fr] sm:gap-14">
                      <div>
                        <p className="mono-label text-accent-deep">Contract number</p>
                        <p className="mt-3 font-mono text-sm text-ink">
                          {/* Never invent one: buyers verify the number with the
                              awarding body before citing it on a requisition. */}
                          {v.number ?? "Provided on request"}
                        </p>
                        <p className="mono-label text-accent-deep mt-8">Who can buy</p>
                        <p className="mt-3 text-graphite leading-relaxed">{v.eligibility}</p>
                      </div>
                      <div>
                        <p className="mono-label text-accent-deep">In scope</p>
                        <ul className="mt-4 space-y-3">
                          {v.scope.map((line) => (
                            <li key={line} className="flex gap-3 text-ink/80 leading-relaxed">
                              <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-brand/60" />
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
