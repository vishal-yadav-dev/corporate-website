"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LEADERSHIP } from "@/lib/data";
import { useReveal } from "@/components/Reveal";

type Leader = {
  id: string;
  name: string;
  title: string;
  bio: string;
  linkedin_url: string;
  photo_id: string | null;
  photo_url: string;
};

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}
function photoSrc(p: Leader) {
  return p.photo_id ? `/api/images/${p.photo_id}` : p.photo_url || "";
}
const fallback: Leader[] = LEADERSHIP.map((p, i) => ({
  id: String(i), name: p.name, title: p.role, bio: p.bio,
  linkedin_url: p.linkedin, photo_id: null, photo_url: "",
}));

/* ---------------- Story modal ---------------- */
function LeaderModal({ leader, onClose }: { leader: Leader; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const src = photoSrc(leader);
  if (typeof document === "undefined") return null;

  /* Portalled to <body>: the section this lives in is `relative z-10`, so an
     in-place overlay would be trapped in that stacking context and painted
     over by later sections. */
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md grid place-items-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-surface border border-line-blue/60 rounded-[24px] w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative shrink-0 bg-[#0a0a0a] grid place-items-center">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={leader.name} className="w-full max-h-[40vh] object-contain" />
          ) : (
            <div className="w-full h-56 grid place-items-center bg-gradient-to-br from-brand via-brand-deep to-[#1a0f08] text-white display text-7xl">
              {initials(leader.name)}
            </div>
          )}
          <button
            onClick={onClose} aria-label="Close"
            className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-black/55 text-white hover:bg-black/75 text-lg"
          >
            ✕
          </button>
        </div>
        <div className="p-6 sm:p-8 overflow-y-auto">
          <p className="mono-label text-brand-bright">Leadership</p>
          <h3 className="display text-2xl sm:text-3xl text-ink mt-1.5">{leader.name}</h3>
          <p className="text-graphite mt-1 text-sm">{leader.title}</p>
          {leader.bio && <p className="mt-4 text-ink/85 leading-relaxed whitespace-pre-wrap text-[14.5px]">{leader.bio}</p>}
          {leader.linkedin_url && (
            <a
              href={leader.linkedin_url} target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-full font-medium hover:bg-brand-deep transition-colors"
            >
              Connect on LinkedIn →
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

/* ---------------- Card: photo on top, name + designation panel below ---------------- */
function StoryCard({ p, i, onOpen }: { p: Leader; i: number; onOpen: () => void }) {
  const src = photoSrc(p);
  const { ref, hidden } = useReveal<HTMLButtonElement>();
  return (
    <motion.button
      ref={ref}
      onClick={onOpen}
      /* Rendered visible; the rise-in only applies to cards still below the
         fold on the client. */
      initial={false}
      animate={hidden ? { opacity: 0, y: 36 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group text-left w-full rounded-2xl overflow-hidden border border-line bg-surface flex flex-col hover:border-brand/50 transition-colors"
    >
      {/* photo */}
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-tint">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src} alt={p.name}
            className="h-full w-full object-cover object-top transition-transform duration-[800ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full grid place-items-center bg-gradient-to-br from-brand via-brand-deep to-[#160c06]">
            <span className="display text-6xl text-white/85">{initials(p.name)}</span>
          </div>
        )}
      </div>

      {/* name + designation card */}
      <div className="p-5 sm:p-6">
        <h3 className="display text-xl text-ink leading-tight group-hover:text-brand transition-colors">{p.name}</h3>
        <p className="text-sm text-graphite mt-1">{p.title}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 mono-label text-accent-deep group-hover:text-brand transition-colors">
          Read the story →
        </span>
      </div>
    </motion.button>
  );
}

/* ---------------- Section ---------------- */
export default function Leadership({ initialLeaders }: { initialLeaders?: Leader[] }) {
  const [leaders, setLeaders] = useState<Leader[]>(initialLeaders?.length ? initialLeaders : fallback);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    // Server-rendered leaders need no client fetch — and no flash of the
    // bundled placeholder names before the real ones arrive.
    if (initialLeaders?.length) return;
    fetch("/api/leaders")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.leaders) && d.leaders.length) setLeaders(d.leaders); })
      .catch(() => {});
    // initialLeaders is a server-rendered prop; it does not change client-side.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 scene" style={{ perspective: 1400 }}>
        {leaders.map((p, i) => (
          <StoryCard key={p.id} p={p} i={i} onOpen={() => setActiveIdx(i)} />
        ))}
      </div>

      <AnimatePresence>
        {activeIdx !== null && leaders[activeIdx] && (
          <LeaderModal leader={leaders[activeIdx]} onClose={() => setActiveIdx(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
