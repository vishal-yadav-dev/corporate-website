"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type StoryItem = {
  kicker?: string;
  title: string;
  body: string;
  image?: string;
  /** optional extra node rendered under the body */
  extra?: ReactNode;
};

const PRISM = ["#E5352F", "#F1531E", "#F5A623", "#27B36B", "#2F97DB", "#7E5BE6"];

/** Generated abstract art per step — prism-coloured, no assets needed. */
function StoryArt({ index }: { index: number }) {
  const a = PRISM[index % 6];
  const b = PRISM[(index + 1) % 6];
  const c = PRISM[(index + 2) % 6];
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-surface-2 via-paper-tint to-surface overflow-hidden">
      <div className="absolute inset-0 bg-dotgrid opacity-25" />
      <div className="anim-drift pointer-events-none absolute -top-16 -left-10 h-64 w-64 rounded-full blur-[110px]" style={{ background: a, opacity: 0.28 }} />
      <div className="anim-drift pointer-events-none absolute -bottom-16 -right-10 h-72 w-72 rounded-full blur-[120px]" style={{ background: b, opacity: 0.22, animationDelay: "-5s" }} />
      <svg viewBox="0 0 400 400" className="relative w-2/3 max-w-[280px] anim-float" fill="none">
        {/* concentric arcs */}
        {[130, 100, 70, 40].map((r, i) => (
          <circle key={r} cx="200" cy="200" r={r} stroke={PRISM[(index + i) % 6]} strokeOpacity={0.5 - i * 0.08} strokeWidth="2" />
        ))}
        {/* connecting lines + nodes rotated per index */}
        <g transform={`rotate(${index * 22} 200 200)`}>
          {[0, 72, 144, 216, 288].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x = 200 + Math.cos(rad) * 130;
            const y = 200 + Math.sin(rad) * 130;
            return (
              <g key={deg}>
                <line x1="200" y1="200" x2={x} y2={y} stroke={c} strokeOpacity="0.35" strokeWidth="1.5" />
                <circle cx={x} cy={y} r={i === index % 5 ? 9 : 5} fill={PRISM[i % 6]} />
              </g>
            );
          })}
        </g>
        <circle cx="200" cy="200" r="16" fill={a} />
        <circle cx="200" cy="200" r="16" fill="#fff" fillOpacity="0.15" />
      </svg>
    </div>
  );
}

/**
 * Accenture-style scroll narrative: a sticky visual on the left that slides /
 * cross-fades as each block on the right scrolls into view.
 */
export default function ScrollStory({
  items,
  eyebrow,
  heading,
}: {
  items: StoryItem[];
  eyebrow?: string;
  heading?: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  const current = items[active];

  return (
    <section className="relative z-10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {(eyebrow || heading) && (
          <div className="mb-14">
            {eyebrow && <p className="mono-label text-accent-deep mb-4">{eyebrow}</p>}
            {heading && <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">{heading}</h2>}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-20">
          {/* Sticky visual */}
          <div className="hidden lg:block">
            <div className="sticky top-28 h-[68vh] scene">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 60, rotateY: 8 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: -60, rotateY: -8 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 rounded-3xl overflow-hidden border border-line surface-card preserve-3d"
                >
                  {current.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={current.image} alt={current.title} className="h-full w-full object-cover" />
                  ) : (
                    <StoryArt index={active} />
                  )}
                  <div className="absolute left-6 bottom-6 right-6">
                    {current.kicker && <p className="mono-label text-accent-deep">{current.kicker}</p>}
                    <p className="display text-2xl text-ink mt-1">{current.title}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* progress rail */}
              <div className="absolute -left-5 top-0 bottom-0 w-px bg-line">
                <motion.div
                  className="w-px bg-brand"
                  animate={{ height: `${((active + 1) / items.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </div>

          {/* Scrolling blocks */}
          <div>
            {items.map((it, i) => (
              <div
                key={i}
                data-idx={i}
                ref={(el) => { refs.current[i] = el; }}
                className="min-h-[60vh] lg:min-h-[68vh] flex flex-col justify-center py-10"
              >
                {/* mobile visual */}
                <div className="lg:hidden mb-6 rounded-2xl overflow-hidden border border-line aspect-[4/3] relative">
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.image} alt={it.title} className="h-full w-full object-cover" />
                  ) : (
                    <StoryArt index={i} />
                  )}
                </div>
                {it.kicker && <p className="mono-label text-accent-deep mb-3">{it.kicker}</p>}
                <h3 className="display text-3xl sm:text-5xl text-ink">{it.title}</h3>
                <p className="mt-5 text-lg text-graphite leading-relaxed max-w-lg">{it.body}</p>
                {it.extra}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
