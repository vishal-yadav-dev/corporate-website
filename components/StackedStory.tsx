"use client";

import { useReveal } from "@/components/Reveal";

/**
 * A deck of cards that pins and stacks as you scroll.
 *
 * Deliberately a different device from PinnedStory, which pins a background and
 * lets cards travel over it. Here each card sticks at an increasing offset, so
 * the previous one stays visible underneath and the set builds into a pile —
 * the reading order becomes physical.
 *
 * Implemented with CSS `position: sticky` and an inline `top`, so the browser
 * drives it; there is no scroll listener and nothing recalculates per frame.
 */
export default function StackedStory({
  eyebrow,
  heading,
  intro,
  accentClass = "bg-brand",
  items,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  intro?: string;
  accentClass?: string;
  items: { title: string; body: string }[];
}) {
  return (
    <section className="relative z-10 bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="mb-10 max-w-3xl">
          <Head eyebrow={eyebrow} heading={heading} intro={intro} />
        </div>

        <div className="relative">
          {items.map((it, i) => (
            <Card key={it.title} index={i} total={items.length} accentClass={accentClass} {...it} />
          ))}
        </div>

        {/* Tail space so the last card can settle before the section ends. */}
        <div className="h-[8vh]" aria-hidden />
      </div>
    </section>
  );
}

function Head({ eyebrow, heading, intro }: { eyebrow: string; heading: React.ReactNode; intro?: string }) {
  const { ref, hidden } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(20px)" : "none",
        transition: "opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <p className="mono-label text-accent-deep mb-4">{eyebrow}</p>
      <h2 className="display text-4xl sm:text-6xl text-ink">{heading}</h2>
      {intro && <p className="mt-6 text-graphite leading-relaxed">{intro}</p>}
    </div>
  );
}

function Card({
  title,
  body,
  index,
  total,
  accentClass,
}: {
  title: string;
  body: string;
  index: number;
  total: number;
  accentClass: string;
}) {
  /* Each card pins 18px lower than the one before, so the stack fans out and
     the earlier titles stay readable behind the current card. */
  const top = 112 + index * 18;

  return (
    <div className="sticky" style={{ top }}>
      <article
        className="group relative overflow-hidden rounded-[28px] border border-line bg-surface p-8 sm:p-12 mb-6 transition-colors hover:border-brand/50"
        style={{
          /* A touch of scale on the cards underneath keeps the pile readable. */
          transform: `scale(${1 - (total - 1 - index) * 0.012})`,
          boxShadow: "0 30px 80px -40px rgba(0,0,0,0.8)",
        }}
      >
        <span aria-hidden className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full ${accentClass} prism-wash blur-[100px] transition-opacity duration-500 group-hover:opacity-25`} />
        <div className="relative flex flex-wrap items-baseline gap-5">
          <span className="display text-5xl sm:text-7xl text-ink/15 leading-none">0{index + 1}</span>
          <h3 className="display text-2xl sm:text-4xl text-ink">{title}</h3>
        </div>
        <p className="relative mt-6 max-w-3xl text-lg text-ink/75 leading-relaxed">{body}</p>
        <span aria-hidden className="relative mt-8 block h-px w-12 origin-left bg-brand/50 transition-transform duration-500 group-hover:scale-x-[3]" />
      </article>
    </div>
  );
}
