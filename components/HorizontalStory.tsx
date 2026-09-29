"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * A pinned section whose cards travel sideways as the page scrolls down.
 *
 * The third device in the set: practices pin a background and let cards pass
 * over it, solutions stack cards into a pile, and industries move laterally.
 *
 * Scroll-linked transforms are expensive on phones, so below `lg` this renders
 * as a plain vertical list and the pinning never engages. It also falls back to
 * the list under prefers-reduced-motion.
 */
export default function HorizontalStory({
  eyebrow,
  heading,
  accentClass = "bg-brand",
  items,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  accentClass?: string;
  items: { title: string; body: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  /* Travel far enough to bring the last card fully into view. */
  const distance = Math.max(0, items.length - 1) * 46;
  const x = useTransform(scrollYProgress, [0, 1], ["2%", `-${distance}%`]);

  return (
    <>
      {/* Desktop: pinned, moving sideways */}
      <section ref={ref} className="relative hidden lg:block bg-paper border-y border-line" style={{ height: `${items.length * 80}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          <span aria-hidden className={`pointer-events-none absolute -left-40 top-1/4 h-[60vh] w-[60vh] rounded-full ${accentClass} opacity-[0.12] blur-[150px]`} />
          <div className="mx-auto max-w-[1400px] w-full px-8">
            <p className="mono-label text-accent-deep mb-4">{eyebrow}</p>
            <h2 className="display text-5xl xl:text-7xl text-ink max-w-3xl mb-14">{heading}</h2>
          </div>

          <motion.ol style={reduced ? undefined : { x }} className="flex gap-6 pl-8 xl:pl-[max(2rem,calc((100vw-1400px)/2+2rem))]">
            {items.map((it, i) => (
              <li key={it.title} className="w-[clamp(320px,30vw,460px)] shrink-0">
                <article className="group h-full rounded-[28px] border border-line bg-surface p-9 hover:border-brand/50 transition-colors">
                  <span className="display text-6xl text-ink/12 leading-none">0{i + 1}</span>
                  <h3 className="display text-2xl xl:text-3xl text-ink mt-5">{it.title}</h3>
                  <p className="mt-5 text-ink/75 leading-relaxed">{it.body}</p>
                  <span aria-hidden className="mt-8 block h-px w-10 origin-left bg-brand/50 transition-transform duration-500 group-hover:scale-x-[3]" />
                </article>
              </li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* Phones and tablets: the same content, read vertically */}
      <section className="relative lg:hidden bg-paper border-y border-line py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <p className="mono-label text-accent-deep mb-4">{eyebrow}</p>
          <h2 className="display text-4xl sm:text-5xl text-ink mb-10">{heading}</h2>
          <ol className="space-y-5">
            {items.map((it, i) => (
              <li key={it.title}>
                <article className="rounded-2xl border border-line bg-surface p-7">
                  <span className="display text-4xl text-ink/15 leading-none">0{i + 1}</span>
                  <h3 className="display text-2xl text-ink mt-4">{it.title}</h3>
                  <p className="mt-4 text-ink/75 leading-relaxed">{it.body}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
