"use client";

import { useEffect, useRef, useState } from "react";
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

  /* How far the row has to travel is measured, not guessed. It used to be
     `(items.length - 1) * 46%` of the row's own width, which overshot: the
     cards finished somewhere off the left edge and the last part of the scroll
     was spent staring at an empty panel with no sign that the page continued.
     Measured, the row stops with the final card resting at the right edge. */
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [maxX, setMaxX] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const view = viewRef.current;
      if (!track || !view) return;
      // a little tail so the last card is not flush against the edge
      setMaxX(Math.max(0, track.scrollWidth - view.clientWidth + 32));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items.length]);

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  return (
    <>
      {/* Desktop: pinned, moving sideways */}
      <section ref={ref} className="relative hidden lg:block bg-paper border-y border-line" style={{ height: `${items.length * 80}vh` }}>
        {/* Anchored to the top of the pinned viewport, not centred in it. The
            heading and the row together are shorter than a tall screen, so
            `justify-center` put a few hundred pixels of nothing between the
            previous section and this heading, which read as a gap in the page
            rather than as a composition. */}
        <div ref={viewRef} className="sticky top-0 h-screen overflow-hidden flex flex-col justify-start pt-24 xl:pt-28">
          <span aria-hidden className={`pointer-events-none absolute -left-40 top-1/4 h-[60vh] w-[60vh] rounded-full ${accentClass} prism-wash-lg blur-[150px]`} />
          <div className="mx-auto max-w-[1400px] w-full px-8">
            <p className="mono-label text-accent-deep mb-4">{eyebrow}</p>
            <h2 className="display text-5xl xl:text-7xl text-ink max-w-3xl mb-8">{heading}</h2>
          </div>

          <motion.ol ref={trackRef} style={reduced ? undefined : { x }} className="flex gap-6 pl-8 xl:pl-[max(2rem,calc((100vw-1400px)/2+2rem))]">
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
      <section className="relative lg:hidden bg-paper border-y border-line py-14 sm:py-16">
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
