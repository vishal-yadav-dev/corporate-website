"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/use-theme";

/**
 * Particles carried by a slow-turning field, leaving trails.
 *
 * Nothing is cleared between frames. Each one lays a translucent wash of the
 * page colour over the last, so every path fades out behind its own head —
 * that decay is the whole look, and it is also why this costs one short line
 * per particle rather than a redraw of anything.
 *
 * The field is value noise, not layered sines: sines give a regular, obviously
 * mathematical weave, while noise wanders. Two octaves is enough at this scale
 * and the second is cheap.
 *
 * The pointer adds a swirl around itself rather than pushing particles away —
 * a repulsion leaves a visible hole, a swirl bends the flow and stays part of
 * the picture.
 *
 * Canvas 2D, count scaled to the area and capped hard on touch, paused off
 * screen, and it never starts under prefers-reduced-motion.
 */
const PRISM = ["#F1531E", "#2F97DB", "#7E5BE6", "#27B36B", "#F5A623", "#E5352F"];

/**
 * Per-slide character. The device stays the same — it is one background, not a
 * gallery of effects — but each slide gets its own three-colour slice of the
 * prism, its own pace and its own field scale, so the carousel does not play
 * the same picture three times.
 */
function tune(seed: number) {
  const k = ((seed % 3) + 3) % 3;
  return {
    palette: [PRISM[k], PRISM[(k + 2) % 6], PRISM[(k + 4) % 6]],
    /* how fast the field itself turns */
    drift: [0.00008, 0.00013, 0.00006][k],
    /* how large the eddies are */
    scale: [0.0022, 0.0016, 0.0029][k],
  };
}

/* hash-based value noise: deterministic, no table to ship */
function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
function smooth(t: number) {
  return t * t * (3 - 2 * t);
}
function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return (a + (b - a) * xf) * (1 - yf) + (c + (d - c) * xf) * yf;
}

export default function FlowField({ seed = 0 }: { seed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  /* Held in a ref, not a dependency: changing slide must not tear down the
     canvas. Particles pick their colour when they respawn, so the field drifts
     into the new palette over a few seconds instead of cutting to it. */
  const cfg = useRef(tune(seed));
  cfg.current = tune(seed);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;

    const light = theme === "light";
    /* the wash that produces the trails, and the first paint */
    const BG = light ? "255,255,255" : "8,9,12";
    const FADE = light ? 0.03 : 0.06;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    type P = { x: number; y: number; px: number; py: number; hue: string; life: number };
    let parts: P[] = [];
    const ptr = { x: -9999, y: -9999, ex: -9999, ey: -9999 };

    const spawn = (p: P) => {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.px = p.x;
      p.py = p.y;
      p.life = 60 + Math.random() * 220;
      const pal = cfg.current.palette;
      p.hue = pal[(Math.random() * pal.length) | 0];
    };

    const build = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = `rgb(${BG})`;
      ctx.fillRect(0, 0, w, h);

      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const n = Math.max(120, Math.min(coarse ? 320 : 850, Math.round((w * h) / 1600)));
      parts = Array.from({ length: n }, () => {
        const p: P = { x: 0, y: 0, px: 0, py: 0, hue: "#F1531E", life: 0 };
        spawn(p);
        return p;
      });
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
      const time = t * cfg.current.drift;

      /* the wash: last frame decays under this instead of being erased */
      ctx.fillStyle = `rgba(${BG},${FADE})`;
      ctx.fillRect(0, 0, w, h);

      ptr.ex += (ptr.x - ptr.ex) * 0.08;
      ptr.ey += (ptr.y - ptr.ey) * 0.08;

      ctx.globalCompositeOperation = light ? "source-over" : "lighter";
      ctx.lineCap = "round";

      for (const p of parts) {
        const sc = cfg.current.scale;
        const nx = p.x * sc;
        const ny = p.y * sc;
        /* two octaves — the second only perturbs the first */
        const a =
          (noise(nx, ny + time) * 2 - 1) * Math.PI * 2 +
          (noise(nx * 2.3 + 11, ny * 2.3 - time) * 2 - 1) * 1.1;

        let vx = Math.cos(a);
        let vy = Math.sin(a);

        /* swirl around the pointer: rotate the velocity, do not displace it */
        const dx = p.x - ptr.ex;
        const dy = p.y - ptr.ey;
        const d = Math.hypot(dx, dy);
        const reach = 220;
        if (d < reach) {
          const k = (1 - d / reach) ** 2 * 1.6;
          const cs = Math.cos(k);
          const sn = Math.sin(k);
          const rx = vx * cs - vy * sn;
          const ry = vx * sn + vy * cs;
          vx = rx;
          vy = ry;
        }

        p.px = p.x;
        p.py = p.y;
        p.x += vx * 1.25;
        p.y += vy * 1.25;
        p.life--;

        if (p.life <= 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          spawn(p);
          continue;
        }

        ctx.strokeStyle = p.hue;
        ctx.globalAlpha = light ? 0.42 : 0.16;
        ctx.lineWidth = light ? 1.35 : 0.9;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
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
  }, [theme]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
