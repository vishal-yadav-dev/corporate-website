"use client";

import { useReveal } from "@/components/Reveal";

/**
 * The record strip under a contract vehicle's headline.
 *
 * The cells arrive left to right and each one's divider is drawn downward just
 * behind it, so the strip reads as a record being filled in rather than a row
 * of boxes fading up together. The dividers are drawn here instead of with
 * Tailwind's `divide-*` because a border cannot be animated on its own.
 */
export default function FactStrip({
  facts,
}: {
  facts: { label: string; value: string; mono?: boolean }[];
}) {
  const { ref, hidden } = useReveal<HTMLDListElement>();
  const EASE = "cubic-bezier(.22,1,.36,1)";

  return (
    <dl ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-5">
      {facts.map((f, i) => {
        const delay = i * 0.09;
        return (
          <div key={f.label} className="relative py-8 lg:px-8 first:lg:pl-0 last:lg:pr-0">
            {/* Vertical on wide screens, horizontal once the grid wraps. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 hidden h-full w-px origin-top bg-line lg:block"
              style={{
                transform: hidden ? "scaleY(0)" : "scaleY(1)",
                transition: `transform .7s ${EASE} ${delay}s`,
                opacity: i === 0 ? 0 : 1,
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-line lg:hidden"
              style={{
                transform: hidden ? "scaleX(0)" : "scaleX(1)",
                transition: `transform .7s ${EASE} ${delay}s`,
                opacity: i === 0 ? 0 : 1,
              }}
            />
            <div
              style={{
                opacity: hidden ? 0 : 1,
                transform: hidden ? "translateY(14px)" : "none",
                transition: `opacity .55s ${EASE} ${delay}s, transform .55s ${EASE} ${delay}s`,
              }}
            >
              <dt className="mono-label text-accent-deep">{f.label}</dt>
              <dd className={`mt-3 leading-relaxed ${f.mono ? "font-mono text-sm text-ink" : "text-sm text-ink/80"}`}>
                {f.value}
              </dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}
