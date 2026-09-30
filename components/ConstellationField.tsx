"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/use-theme";

/**
 * A drifting particle network, for the space behind a content section.
 *
 * Points wander and wrap at the edges; any two closer than a threshold are
 * joined by a line whose weight falls off with the distance between them, so
 * the mesh keeps forming and dissolving on its own. The pointer is treated as
 * one more node — points near it brighten and link to it — which is what makes
 * the field feel answered rather than merely animated.
 *
 * Point count is derived from the area and capped, because this sits behind a
 * whole section rather than a header and that section can be very tall. The
 * pair test is O(n²) but n is small by construction.
 *
 * Canvas 2D so it runs on phones, paused when scrolled past, and never started
 * under prefers-reduced-motion. Colours come from the theme: white points over
 * near-black, ink points over white, since a field tuned for one is invisible
 * on the other.
 */
export default function ConstellationField({
  /** distance at which two points stop being linked, in CSS pixels */
  link = 124,
}: {
  link?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const light = theme === "light";
    const DOT = light ? "22,32,43" : "255,255,255";
    const LINE = light ? "30,136,199" : "47,151,219";
    const HOT = light ? "226,72,27" : "241,83,30";
    const DOT_A = light ? 0.55 : 0.5;
    const LINE_A = light ? 0.26 : 0.16;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    type P = { x: number; y: number; vx: number; vy: number; r: number; tw: number };
    let pts: P[] = [];
    const ptr = { x: -9999, y: -9999 };

    const build = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* One point per ~7.5k px². The pair test grows with the square of the
         count, so the cap is what actually protects the frame budget — and a
         phone gets a much lower one, since it is doing this behind a section
         that can run several screens tall. */
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const n = Math.max(45, Math.min(coarse ? 120 : 240, Math.round((w * h) / 7500)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: 0.9 + Math.random() * 1.3,
        tw: Math.random() * Math.PI * 2,
      }));
    };
    build();

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
    };
    const onLeave = () => {
      ptr.x = -9999;
      ptr.y = -9999;
    };

    const draw = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const time = t * 0.001;
      const link2 = link * link;

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        /* wrap rather than bounce: a bounce makes the edges visible */
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > link2) continue;
          const k = 1 - Math.sqrt(d2) / link;
          ctx.globalAlpha = k * LINE_A;
          ctx.strokeStyle = `rgb(${LINE})`;
          ctx.lineWidth = 0.4 + k * 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      /* the pointer is just another node */
      for (const p of pts) {
        const dx = p.x - ptr.x;
        const dy = p.y - ptr.y;
        const d2 = dx * dx + dy * dy;
        const reach = link * 1.25;
        if (d2 < reach * reach) {
          const k = 1 - Math.sqrt(d2) / reach;
          ctx.globalAlpha = k * 0.55;
          ctx.strokeStyle = `rgb(${HOT})`;
          ctx.lineWidth = 0.5 + k * 1.1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(ptr.x, ptr.y);
          ctx.stroke();
        }

        const twinkle = 0.65 + 0.35 * Math.sin(time * 1.6 + p.tw);
        const near = d2 < reach * reach ? 1 - Math.sqrt(d2) / reach : 0;
        ctx.globalAlpha = DOT_A * twinkle + near * 0.4;
        ctx.fillStyle = near > 0.35 ? `rgb(${HOT})` : `rgb(${DOT})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + near * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !raf) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!e.isIntersecting && raf) {
          running = false;
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(cv);

    window.addEventListener("resize", build);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", build);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [theme, link]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
