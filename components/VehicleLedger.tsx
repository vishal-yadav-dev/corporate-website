"use client";

import Link from "next/link";
import { useReveal } from "@/components/Reveal";
import type { VehicleGroup } from "@/lib/contracts";

/**
 * The vehicles themselves, set as a ledger rather than as cards.
 *
 * A procurement officer reads this page to find the contract they can order
 * against, so the layout is a document: hairline rules, the awarding body in a
 * fixed column, and each row opening its own page.
 *
 * The motion follows that idea rather than borrowing the card entrances used
 * elsewhere — each row's rule is drawn across from the left as the row arrives,
 * so the section reads as a ledger being written down the page. Rules are the
 * only thing on their own timing; everything else rides the row.
 */
export default function VehicleLedger({ groups }: { groups: VehicleGroup[] }) {
  return (
    <section className="relative z-10 bg-paper pt-16 sm:pt-24 pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {groups.map((group, gi) => (
          <div key={group.id} id={group.id} className="scroll-mt-28 mb-20 sm:mb-28 last:mb-0">
            <GroupHead index={gi} title={group.title} note={group.note} />
            <ul>
              {group.vehicles.map((v, i) => (
                <Row
                  key={v.id}
                  index={i}
                  href={`/company/contract-vehicles/${v.id}`}
                  authority={v.authority}
                  name={v.name}
                  summary={v.summary}
                  number={v.number}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

const EASE = "cubic-bezier(.22,1,.36,1)";

function GroupHead({ index, title, note }: { index: number; title: string; note: string }) {
  const { ref, hidden } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 lg:gap-16 pb-10 relative">
      <div
        style={{
          opacity: hidden ? 0 : 1,
          transform: hidden ? "translateY(18px)" : "none",
          transition: `opacity .6s ${EASE}, transform .6s ${EASE}`,
        }}
      >
        <span className="mono-label text-accent-deep">{`0${index + 1} / Vehicles`}</span>
        <h2 className="display text-3xl sm:text-5xl text-ink mt-4">{title}</h2>
      </div>
      <p
        className="text-graphite leading-relaxed lg:pt-10"
        style={{
          opacity: hidden ? 0 : 1,
          transform: hidden ? "translateY(18px)" : "none",
          transition: `opacity .6s ${EASE} .08s, transform .6s ${EASE} .08s`,
        }}
      >
        {note}
      </p>
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-line"
        style={{ transform: hidden ? "scaleX(0)" : "scaleX(1)", transition: `transform .8s ${EASE} .1s` }}
      />
    </div>
  );
}

function Row({
  index,
  href,
  authority,
  name,
  summary,
  number,
}: {
  index: number;
  href: string;
  authority: string;
  name: string;
  summary: string;
  number?: string;
}) {
  const { ref, hidden } = useReveal<HTMLLIElement>();
  const delay = index * 0.07;

  return (
    <li ref={ref} className="relative">
      <Link
        href={href}
        className="group flex items-start gap-5 py-7 sm:py-9 transition-colors hover:bg-surface/60"
        style={{
          opacity: hidden ? 0 : 1,
          transform: hidden ? "translateY(16px)" : "none",
          transition: `opacity .55s ${EASE} ${delay}s, transform .55s ${EASE} ${delay}s, background-color .2s`,
        }}
      >
        <span className="flex-1">
          <span className="mono-label text-graphite">{authority}</span>
          <span className="display block text-xl sm:text-3xl text-ink mt-2 group-hover:text-brand transition-colors">
            {name}
          </span>
          <span className="mt-2 block max-w-2xl text-graphite leading-relaxed">{summary}</span>
          <span className="mono-label text-accent-deep mt-4 inline-block">
            Contract # {/* Never invent one: buyers verify the number with the
                           awarding body before citing it on a requisition. */}
            {number ?? "provided on request"}
          </span>
        </span>
        <span
          aria-hidden
          className="mt-3 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-blue text-accent-deep transition-all duration-300 group-hover:border-brand/50 group-hover:text-brand group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
      {/* The rule is drawn rather than simply revealed. */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-line"
        style={{
          transform: hidden ? "scaleX(0)" : "scaleX(1)",
          transition: `transform .85s ${EASE} ${delay + 0.12}s`,
        }}
      />
    </li>
  );
}
