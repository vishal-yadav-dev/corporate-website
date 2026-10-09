"use client";

import { motion } from "framer-motion";
import { useReveal } from "@/components/Reveal";

/**
 * A pinned visual with cards scrolling over it — the same device the homepage
 * uses for "The platforms we live in", generalised so any page can use it.
 *
 * The background is sticky and full-height; the cards scroll past it. Motion is
 * transform-only so it composites, and the drifting glows inherit `.anim-drift`,
 * which globals.css already disables on touch and small screens.
 */
export default function PinnedStory({
  eyebrow,
  heading,
  accentClass = "bg-brand",
  items,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  /** tailwind background class used for the glows and the card index */
  accentClass?: string;
  items: { title: string; body: string }[];
}) {
  return (
    <section className="relative bg-paper border-y border-line">
      {/* Pinned background */}
      <div className="sticky top-0 h-screen overflow-hidden scene">
        <div className="absolute inset-0 bg-dotgrid anim-grid opacity-[0.22]" />
        <div className={`anim-drift pointer-events-none absolute -top-1/4 right-[-10%] h-[70vh] w-[70vh] rounded-full ${accentClass} prism-wash-lg blur-[160px]`} />
        <div className="anim-drift pointer-events-none absolute bottom-[-20%] left-[-12%] h-[62vh] w-[62vh] rounded-full bg-accent/10 blur-[160px]" style={{ animationDelay: "-5s" }} />

        {/* Anchored to the top on a fixed offset, the way the homepage's pinned
            story does it — a viewport-relative one drifts with window height,
            and this headline has to clear the same fixed 72px nav on every
            screen. Centring it, which is what this used to do, put its lower
            edge well below halfway once it ran to two lines. */}
        <div className="relative h-full grid items-start px-5 sm:px-8 pt-28 sm:pt-32">
          <div className="mx-auto max-w-[87.5rem] w-full">
            <p className="mono-label text-accent-deep mb-5">{eyebrow}</p>
            <h2 className="display text-5xl sm:text-7xl lg:text-8xl text-ink max-w-4xl">{heading}</h2>
          </div>
        </div>
      </div>

      {/* Cards travelling over it */}
      <div className="relative -mt-[100vh]">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 pt-[44vh] lg:pt-[48vh] pb-[16vh] space-y-8 sm:space-y-12 scene" style={{ perspective: 1600 }}>
          {items.map((it, i) => (
            <PinnedCard key={it.title} index={i} even={i % 2 === 0} accentClass={accentClass}>
              <div className="shadow-card relative bg-surface/95 border border-line rounded-[1.75rem] p-8 sm:p-12 backdrop-blur-sm hover:border-brand/50 transition-colors">
                <span className={`mono-label text-graphite`}>0{i + 1}</span>
                <h3 className="display text-3xl sm:text-5xl text-ink mt-4">{it.title}</h3>
                <p className="mt-5 text-lg text-ink/75 leading-relaxed max-w-2xl">{it.body}</p>
              </div>
            </PinnedCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function PinnedCard({
  children,
  index,
  even,
}: {
  children: React.ReactNode;
  index: number;
  even: boolean;
  accentClass?: string;
}) {
  const { ref, hidden } = useReveal<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      /* visible on the server; the rise only applies to cards still below the fold */
      initial={false}
      animate={hidden ? { opacity: 0, y: 60, rotateX: 10 } : { opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.05 }}
      className={`lg:w-[68%] ${even ? "" : "lg:ml-auto"}`}
    >
      {children}
    </motion.div>
  );
}
