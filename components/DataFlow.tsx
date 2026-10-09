"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/use-theme";

/**
 * A network with traffic running through it.
 *
 * The other canvas backgrounds on the site draw structure — a field of points,
 * a mesh that forms and dissolves. This one draws *movement along* that
 * structure: packets leave a node, travel a link, arrive, and the next hop is
 * chosen from whatever that node is connected to now. That is the difference
 * between a picture of a network and a network doing something.
 *
 * Links are recomputed each frame from proximity, so a packet whose link has
 * drifted out of range simply finishes its hop and picks a new one rather than
 * stranding. Node count is capped and far lower on touch, because the link pass
 * is O(n²) and this sits behind a full-width band.
 *
 * Canvas 2D, paused off screen, and it never starts under prefers-reduced-motion.
 */
export default function DataFlow({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const light = theme === "light";
    const NODE = light ? "30,136,199" : "120,190,235";
    const LINE = light ? "30,136,199" : "47,151,219";
    const PACKET = light ? "226,72,27" : "255,122,69";
    const NODE_A = light ? 0.5 : 0.45;
    const LINE_A = light ? 0.3 : 0.2;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;

    type N = { x: number; y: number; vx: number; vy: number; r: number; tw: number };
    type P = { from: number; to: number; t: number; speed: number };
    let nodes: N[] = [];
    let packets: P[] = [];
    let links: [number, number, number][] = []; // a, b, closeness
    const ptr = { x: -9999, y: -9999 };
    const LINK = 150;

    const build = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const n = Math.max(24, Math.min(coarse ? 44 : 90, Math.round(((w * h) / 16000) * density)));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        r: 1 + Math.random() * 1.6,
        tw: Math.random() * Math.PI * 2,
      }));
      packets = Array.from({ length: Math.round(n * 0.5) }, () => ({
        from: (Math.random() * n) | 0,
        to: (Math.random() * n) | 0,
        t: Math.random(),
        speed: 0.004 + Math.random() * 0.007,
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

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }

      /* links, rebuilt each frame so the packets always have a current graph */
      links = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const k = 1 - Math.sqrt(d2) / LINK;
          links.push([i, j, k]);
          ctx.globalAlpha = k * LINE_A;
          ctx.strokeStyle = `rgb(${LINE})`;
          ctx.lineWidth = 0.4 + k * 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      /* traffic */
      for (const p of packets) {
        p.t += p.speed;
        if (p.t >= 1) {
          /* arrived: hop on from here, along a link this node actually has */
          const outgoing = links.filter((l) => l[0] === p.to || l[1] === p.to);
          const next = outgoing.length
            ? (() => {
                const l = outgoing[(Math.random() * outgoing.length) | 0];
                return l[0] === p.to ? l[1] : l[0];
              })()
            : (Math.random() * nodes.length) | 0;
          p.from = p.to;
          p.to = next;
          p.t = 0;
        }
        const a = nodes[p.from];
        const b = nodes[p.to];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;

        /* a short trail behind the head reads as direction */
        for (let s = 0; s < 5; s++) {
          const u = Math.max(0, p.t - s * 0.035);
          const tx = a.x + (b.x - a.x) * u;
          const ty = a.y + (b.y - a.y) * u;
          ctx.globalAlpha = (1 - s / 5) * 0.75;
          ctx.fillStyle = `rgb(${PACKET})`;
          ctx.beginPath();
          ctx.arc(tx, ty, 2.1 - s * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      /* nodes last, so traffic passes under them */
      for (const n of nodes) {
        const dx = n.x - ptr.x;
        const dy = n.y - ptr.y;
        const near = Math.hypot(dx, dy) < 170 ? 1 - Math.hypot(dx, dy) / 170 : 0;
        const tw = 0.7 + 0.3 * Math.sin(time * 1.5 + n.tw);
        ctx.globalAlpha = NODE_A * tw + near * 0.45;
        ctx.fillStyle = near > 0.4 ? `rgb(${PACKET})` : `rgb(${NODE})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + near * 1.6, 0, Math.PI * 2);
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
  }, [theme, density]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
