"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-entrance state that defaults to *shown*.
 *
 * The server renders visible, so content is on the page whether or not JS ever
 * runs. On the client, only elements still below the fold are hidden and then
 * animated in — so nothing that is already on screen can flash.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setHidden(true);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setHidden(false);
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, hidden };
}

/**
 * The entrances a section can choose from.
 *
 * Every page on the site used the same lift, which made distinct sections read
 * as one long list. These are the alternatives; `up` stays the default so a
 * section only changes when it asks to.
 *
 * Each is a single transform string — compositor work only, no layout. `blur`
 * is the exception and is reserved for single elements: filtering a whole grid
 * at once is the one effect here a phone would feel.
 */
export type RevealVariant = "up" | "rise" | "left" | "right" | "tilt" | "zoom" | "blur";

const FROM: Record<RevealVariant, { transform: string; filter?: string }> = {
  up:    { transform: "translateY(24px)" },
  rise:  { transform: "translateY(48px) scale(0.965)" },
  left:  { transform: "translateX(-44px)" },
  right: { transform: "translateX(44px)" },
  tilt:  { transform: "perspective(1000px) rotateX(11deg) translateY(30px)" },
  zoom:  { transform: "scale(0.88)" },
  blur:  { transform: "translateY(16px)", filter: "blur(10px)" },
};

export default function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "up",
  duration = 0.6,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: RevealVariant;
  /** Heavier entrances read better a little slower. */
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /* Visible by default. The entrance is an enhancement layered on afterwards —
     if JS is slow, throttled (iOS Low Power Mode) or never runs at all, the
     content is still on the page rather than stranded at opacity 0. */
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only animate what the reader hasn't reached yet; hiding something already
    // on screen would read as a flash.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setHidden(true);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setHidden(false);
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const from = FROM[variant];
  // rounded: staggered delays are computed, and 0.41000000000000003s is what
  // floating point does to them
  const d = +delay.toFixed(3);
  const ease = "cubic-bezier(0.22,1,0.36,1)";
  const props = ["opacity", "transform"];
  if (from.filter) props.push("filter");

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? from.transform : "none",
        filter: from.filter ? (hidden ? from.filter : "none") : undefined,
        transition: props.map((pr) => `${pr} ${duration}s ${ease} ${d}s`).join(", "),
      }}
    >
      {children}
    </div>
  );
}
