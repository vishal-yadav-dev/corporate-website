"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Item = {
  id: string;
  name: string;
  tag: string;
  body: string;
  stack: string[];
  logo: string;
};

/**
 * Accenture-style pinned-background section: a prism visual stays fixed while
 * the platform cards scroll up and over it.
 */
export default function PlatformStory({
  items,
  eyebrow = "Practices",
  heading = "The platforms we live in.",
  intro = "Full-lifecycle delivery on the enterprise platforms your business runs on.",
  standalone = false,
}: {
  items: Item[];
  eyebrow?: string;
  heading?: string;
  intro?: string;
  /** when true, cards are plain (no link) — used on the Practices page itself */
  standalone?: boolean;
}) {
  return (
    <section className="relative bg-paper border-y border-line">
      {/* ---- Pinned background ---- */}
      <div className="sticky top-0 h-screen overflow-hidden scene">
        <div className="absolute inset-0 bg-dotgrid anim-grid opacity-[0.22]" />
        {/* prism glows */}
        <div className="anim-drift pointer-events-none absolute -top-1/4 right-[-10%] h-[70vh] w-[70vh] rounded-full bg-brand/12 blur-[160px]" />
        <div className="anim-drift pointer-events-none absolute bottom-[-20%] left-[-12%] h-[62vh] w-[62vh] rounded-full bg-accent/10 blur-[160px]" style={{ animationDelay: "-5s" }} />
        <div className="anim-drift pointer-events-none absolute top-1/3 left-1/2 h-[40vh] w-[40vh] rounded-full bg-[color:var(--color-accent-2)]/8 blur-[160px]" style={{ animationDelay: "-9s" }} />

        {/* rotating wireframe globe */}
        <div className="preserve-3d anim-spin-3d absolute left-[68%] top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block" style={{ width: "min(52vw,600px)", height: "min(52vw,600px)" }}>
          {[-58, -33, -11, 11, 33, 58].map((deg, i) => (
            <div
              key={`lat${deg}`}
              className="absolute left-1/2 top-1/2 rounded-full border"
              style={{
                width: `${Math.cos((deg * Math.PI) / 180) * 100}%`,
                height: `${Math.cos((deg * Math.PI) / 180) * 100}%`,
                transform: `translate(-50%,-50%) translateZ(${Math.sin((deg * Math.PI) / 180) * 190}px)`,
                borderColor: i % 2 ? "rgba(47,151,219,0.16)" : "rgba(244,124,32,0.18)",
              }}
            />
          ))}
          {[0, 45, 90, 135].map((deg) => (
            <div key={`lon${deg}`} className="absolute inset-0 rounded-full border border-ink/[0.08]" style={{ transform: `rotateY(${deg}deg)` }} />
          ))}
          {[0, 120, 240].map((deg, i) => (
            <span
              key={`sat${deg}`}
              className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full"
              style={{
                transform: `rotateY(${deg}deg) translateZ(min(26vw,300px)) translate(-50%,-50%)`,
                background: ["#F47C20", "#2F97DB", "#2FB57F"][i],
                boxShadow: `0 0 14px ${["#F47C20", "#2F97DB", "#2FB57F"][i]}`,
              }}
            />
          ))}
        </div>

        {/* modest heading anchored to the top */}
        <div className="relative z-[1] mx-auto max-w-[1400px] px-5 sm:px-8 pt-28 sm:pt-32">
          <p className="mono-label text-accent-deep mb-4">{eyebrow}</p>
          <h2 className="display text-4xl sm:text-6xl leading-[0.95] text-ink max-w-2xl">
            {heading}
          </h2>
          <p className="mt-5 text-graphite max-w-md">{intro}</p>
        </div>

        {/* fade to content at the bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
      </div>

      {/* ---- Scrolling cards (overlap the pinned bg) ---- */}
      <div className="relative z-10 -mt-[100vh]">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-[34vh] pb-[14vh] space-y-10 sm:space-y-14 scene" style={{ perspective: 1600 }}>
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 60, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-20% 0px -15% 0px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`lg:w-[66%] ${i % 2 ? "lg:ml-auto" : ""}`}
            >
              <Link
                id={it.id}
                href={standalone ? `#${it.id}` : `/practices#${it.id}`}
                className="card-3d group block rounded-[28px] p-8 sm:p-12 relative overflow-hidden bg-surface/95 backdrop-blur-xl border border-line-blue/60 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] scroll-mt-28"
              >
                <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-brand/10 blur-[110px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="h-px flex-1 bg-line" />
                    <span className="text-brand opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0">Explore →</span>
                  </div>
                  {it.logo && (
                    <span className="inline-grid place-items-center rounded-xl bg-white px-4 h-12 mb-6 ring-1 ring-black/5 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.7)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.logo} alt={`${it.name} logo`} className="h-7 w-auto max-w-[150px] object-contain" />
                    </span>
                  )}
                  <h3 className="display text-4xl sm:text-6xl text-ink">{it.name}</h3>
                  <p className="mt-3 text-accent-deep">{it.tag}</p>
                  <p className="mt-5 text-ink/70 leading-relaxed max-w-xl">{it.body}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {it.stack.slice(0, 5).map((s) => (
                      <span key={s} className="mono-label text-graphite border border-line-blue rounded-full px-3 py-1.5">{s}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
