"use client";

import { useEffect, useRef, useState } from "react";

/* The rounded end of the page. Its two cut corners are painted in the footer's
   colour over the page's own bottom corners, so the page reads as a sheet with
   a rounded edge whatever colour its last section happens to be. */
const CORNER = "pointer-events-none absolute -top-8 h-8 w-8";
const cut = (at: string) =>
  `radial-gradient(circle at ${at}, transparent calc(2rem - 0.5px), var(--color-paper-deep) 2rem)`;

/**
 * The footer, uncovered rather than scrolled to.
 *
 * It stands still at the bottom of the screen while the end of the page lifts
 * away over it, so it reads as something the page was resting on.
 *
 * The footer keeps its place in the flow, and that place is a window: it clips
 * what is inside it, so the footer shows there and nowhere else. Inside, the
 * footer is `sticky` to the bottom of the screen with a screen's height of room
 * above its place to hold still in. Nothing has to cover it, so the page above
 * needs no background of its own, and the browser does the holding with no
 * scroll listener.
 *
 * A footer taller than the screen, as on a phone, is held by its top edge
 * instead and then scrolls on as usual. Held by its bottom, its top would never
 * come into view.
 *
 * The one thing measured is the footer's height: the window needs it, since the
 * footer inside is out of the flow. Until then, and for anyone who has asked
 * for reduced motion, this is a footer in the ordinary place.
 */
export default function FooterReveal({ children }: { children: React.ReactNode }) {
  const holder = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = holder.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const watch = new ResizeObserver(() => setHeight(el.offsetHeight));
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  const on = height !== null;
  return (
    <div className="relative z-20">
      {on && (
        <>
          <span aria-hidden className={`${CORNER} left-0`} style={{ background: cut("100% 0") }} />
          <span aria-hidden className={`${CORNER} right-0`} style={{ background: cut("0 0") }} />
        </>
      )}
      <div
        className={on ? "relative bg-paper-deep [clip-path:inset(0)]" : undefined}
        style={on ? { height } : undefined}
      >
        <div className={on ? "absolute inset-x-0 bottom-0 -top-[100vh] flex flex-col justify-end" : undefined}>
          <div
            ref={holder}
            className={on ? "sticky" : undefined}
            style={on ? { bottom: `min(0px, calc(100dvh - ${height}px))` } : undefined}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
