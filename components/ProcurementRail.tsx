"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useReveal } from "@/components/Reveal";

/**
 * A spine that fills as you read down it.
 *
 * The fourth scroll device in the set, and deliberately unlike the others:
 * practices pin a background, solutions stack into a pile, industries travel
 * sideways. Procurement is a sequence with a fixed order, so the page draws
 * that order as a single line being drawn downward while you read.
 *
 * Only one element is animated by scroll — the line's scaleY — so there is no
 * per-step listener and nothing measures on every frame. The step markers fill
 * from an IntersectionObserver instead.
 */
export default function ProcurementRail({
  eyebrow,
  heading,
  intro,
  steps,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  intro?: string;
  steps: { title: string; body: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 65%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative z-10 bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
        <div className="max-w-3xl mb-10">
          <p className="mono-label text-accent-deep mb-4">{eyebrow}</p>
          <h2 className="display text-4xl sm:text-6xl text-ink">{heading}</h2>
          {intro && <p className="mt-6 text-graphite leading-relaxed">{intro}</p>}
        </div>

        <div ref={ref} className="relative pl-12 sm:pl-20">
          {/* The unlit track, and the lit line drawn over it. */}
          <span aria-hidden className="absolute left-4 sm:left-7 top-2 bottom-2 w-px bg-line" />
          <motion.span
            aria-hidden
            className="absolute left-4 sm:left-7 top-2 bottom-2 w-px origin-top bg-gradient-to-b from-brand via-accent to-brand"
            style={reduced ? { scaleY: 1 } : { scaleY }}
          />

          <ol className="space-y-10 sm:space-y-14">
            {steps.map((s, i) => (
              <Step key={s.title} index={i} {...s} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({ title, body, index }: { title: string; body: string; index: number }) {
  const { ref, hidden } = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className="relative"
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(16px)" : "none",
        transition: "opacity .55s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {/* The marker sits on the rail, so its offset matches the line's left. */}
      <span
        aria-hidden
        className="absolute -left-12 sm:-left-20 top-1 flex h-8 w-8 sm:h-14 sm:w-14 items-center justify-center rounded-full border bg-paper transition-colors duration-500"
        style={{
          borderColor: hidden ? "var(--color-line)" : "color-mix(in oklab, var(--color-brand) 55%, transparent)",
          transform: "translateX(0)",
        }}
      >
        <span className="mono-label text-[0.625rem] sm:text-xs text-accent-deep">0{index + 1}</span>
      </span>
      <h3 className="display text-2xl sm:text-4xl text-ink">{title}</h3>
      <p className="mt-4 max-w-2xl text-ink/75 leading-relaxed">{body}</p>
    </li>
  );
}
