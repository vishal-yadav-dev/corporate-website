"use client";

import { useEffect, useRef } from "react";

const PRISM_COLORS = ["#F1531E", "#2F97DB", "#F5A623", "#27B36B", "#E5352F", "#7E5BE6"];

const THOUGHT_QUOTES = [
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { text: "Technology is best when it brings people together.", author: "Matt Mullenweg" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Software is a combination of artistry and engineering.", author: "Bill Gates" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Perfection is achieved when there is nothing left to take away.", author: "Saint-Exupéry" },
  { text: "The function of good software is to make complex simple.", author: "Grady Booch" },
  { text: "Architecture is about the important decisions.", author: "Ralph Johnson" },
  { text: "Premature optimization is the root of all evil.", author: "Donald Knuth" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Fix the cause, not the symptom.", author: "Steve Maguire" },
  { text: "Digital transformation is about human adaptability.", author: "Satya Nadella" },
  { text: "Clean code looks like it was written by someone who cares.", author: "Robert C. Martin" },
  { text: "Data is the petroleum, intelligence is the engine.", author: "Clive Humby" },
  { text: "Scalability means planning for success before it happens.", author: "Werner Vogels" },
  { text: "Cloud is not a location, it is an operating model.", author: "Andy Jassy" },
  { text: "Design is not just what it looks like, it is how it works.", author: "Steve Jobs" },
  { text: "Automation removes friction, not accountability.", author: "Martin Fowler" },
  { text: "Enterprise platforms must be as intuitive as consumer apps.", author: "Marc Benioff" },
  { text: "Modernization is a continuous evolution, not an event.", author: "Gene Kim" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Systems should be built to evolve, not just to launch.", author: "Rebecca Parsons" },
  { text: "Focus on your core strengths and partner for the rest.", author: "Peter Drucker" },
  { text: "Building great software requires focus on the user outcome.", author: "Grace Hopper" },
  { text: "Good software engineering is a discipline of clarity.", author: "Barbara Liskov" },
];

/**
 * The blog header background: extensive library of non-repeating tech thoughts
 * writing themselves in site PRISM colors, weighted toward the right side.
 */
export default function InkField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Bar = { x: number; y: number; w: number; row: number };
    type Block = {
      x: number; y: number; bars: Bar[];
      t: number; speed: number; hold: number;
      phase: "write" | "hold" | "fade"; alpha: number; hue: number;
    };

    type FloatingQuote = {
      text: string; author: string;
      x: number; y: number; vy: number;
      progress: number;
      alpha: number; maxAlpha: number;
      phase: "type" | "hold" | "fade";
      holdTimer: number;
      color: string;
    };

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; color: string;
    };

    let blocks: Block[] = [];
    let activeQuotes: FloatingQuote[] = [];
    let particles: Particle[] = [];
    let quotePool: number[] = [];
    let w = 0; let h = 0; let raf = 0;

    const shufflePool = () => {
      quotePool = Array.from({ length: THOUGHT_QUOTES.length }, (_, i) => i);
      for (let i = quotePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quotePool[i], quotePool[j]] = [quotePool[j], quotePool[i]];
      }
    };

    const getNextQuoteItem = () => {
      if (quotePool.length === 0) shufflePool();
      const idx = quotePool.pop()!;
      return THOUGHT_QUOTES[idx];
    };

    const readInk = () => {
      const s = getComputedStyle(document.documentElement);
      const accent = s.getPropertyValue("--page-accent").trim() || s.getPropertyValue("--color-brand").trim();
      const ink = s.getPropertyValue("--color-ink").trim() || "#808a96";
      return { accent: accent || "#f1531e", ink };
    };
    let palette = readInk();

    const makeQuote = (): FloatingQuote => {
      const item = getNextQuoteItem();
      const isRightSide = Math.random() < 0.78;
      const posX = isRightSide
        ? w * 0.46 + Math.random() * Math.max(60, w * 0.46 - 360)
        : 30 + Math.random() * Math.max(50, w * 0.35 - 320);

      const color = PRISM_COLORS[Math.floor(Math.random() * PRISM_COLORS.length)];

      return {
        text: `"${item.text}"`,
        author: `— ${item.author}`,
        x: Math.max(20, Math.min(w - 360, posX)),
        y: 70 + Math.random() * Math.max(80, h - 140),
        vy: -0.10 - Math.random() * 0.14,
        progress: 0,
        alpha: 0,
        maxAlpha: 0.28 + Math.random() * 0.22,
        phase: "type",
        holdTimer: 200 + Math.random() * 160,
        color,
      };
    };

    const makeBlock = (): Block => {
      const lineH = 7 + Math.random() * 3;
      const lines = 2 + Math.floor(Math.random() * 4);
      const colW = 110 + Math.random() * 190;
      const bars: Bar[] = [];
      for (let row = 0; row < lines; row++) {
        let x = 0;
        const limit = row === lines - 1 ? colW * (0.35 + Math.random() * 0.4) : colW;
        while (x < limit) {
          const word = 14 + Math.random() * 34;
          if (x + word > limit) break;
          bars.push({ x, y: row * lineH * 1.9, w: word, row });
          x += word + 7 + Math.random() * 5;
        }
      }
      return {
        x: Math.random() * Math.max(1, w - colW),
        y: Math.random() * Math.max(1, h - lines * lineH * 2),
        bars,
        t: 0,
        speed: 0.002 + Math.random() * 0.003,
        hold: 90 + Math.random() * 160,
        phase: "write",
        alpha: 0,
        hue: Math.random() < 0.35 ? 1 : 0,
      };
    };

    const addParticles = (px: number, py: number) => {
      if (reduced || particles.length > 60) return;
      for (let i = 0; i < 2; i++) {
        const pColor = PRISM_COLORS[Math.floor(Math.random() * PRISM_COLORS.length)];
        particles.push({
          x: px + (Math.random() - 0.5) * 12,
          y: py + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -0.4 - Math.random() * 0.8,
          size: 2 + Math.random() * 3.5,
          alpha: 0.85,
          color: pColor,
        });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      addParticles(px, py);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      palette = readInk();
      shufflePool();

      const count = Math.max(3, Math.min(7, Math.round((w * h) / 160000)));
      blocks = Array.from({ length: count }, () => {
        const b = makeBlock();
        b.t = Math.random();
        b.alpha = 1;
        b.phase = Math.random() < 0.5 ? "write" : "hold";
        return b;
      });

      const qCount = Math.max(3, Math.min(5, Math.round(w / 340)));
      activeQuotes = Array.from({ length: qCount }, makeQuote);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // 1. Ambient Background Radial Glows
      const grad1 = ctx.createRadialGradient(w * 0.8, h * 0.3, 20, w * 0.8, h * 0.3, w * 0.5);
      grad1.addColorStop(0, "rgba(241, 83, 30, 0.10)");
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, w, h);

      const grad2 = ctx.createRadialGradient(w * 0.2, h * 0.75, 20, w * 0.2, h * 0.75, w * 0.45);
      grad2.addColorStop(0, "rgba(47, 151, 219, 0.08)");
      grad2.addColorStop(1, "transparent");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);

      // 2. Render Paragraph Writing Blocks
      for (const b of blocks) {
        if (b.phase === "write") {
          b.t += b.speed * (reduced ? 0 : 1);
          b.alpha = Math.min(1, b.alpha + 0.02);
          if (b.t >= 1) { b.t = 1; b.phase = "hold"; }
        } else if (b.phase === "hold") {
          b.hold -= reduced ? 0 : 1;
          if (b.hold <= 0) b.phase = "fade";
        } else {
          b.alpha -= 0.008;
          if (b.alpha <= 0) Object.assign(b, makeBlock());
        }

        const written = b.bars.length * b.t;
        for (let i = 0; i < b.bars.length; i++) {
          const bar = b.bars[i];
          const fill = Math.max(0, Math.min(1, written - i));
          if (fill <= 0) break;
          ctx.globalAlpha = b.alpha * (b.hue ? 0.45 : 0.22);
          ctx.fillStyle = b.hue ? palette.accent : palette.ink;
          const bw = bar.w * fill;
          const x = b.x + bar.x;
          const y = b.y + bar.y;
          ctx.beginPath();
          const r = 1.6;
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + bw - r, y);
          ctx.quadraticCurveTo(x + bw, y, x + bw, y + r);
          ctx.lineTo(x + bw, y + 3 - r);
          ctx.quadraticCurveTo(x + bw, y + 3, x + bw - r, y + 3);
          ctx.lineTo(x + r, y + 3);
          ctx.quadraticCurveTo(x, y + 3, x, y + 3 - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.fill();
        }

        if (b.phase === "write" && !reduced) {
          const i = Math.min(b.bars.length - 1, Math.floor(written));
          const bar = b.bars[i];
          if (bar) {
            const fill = Math.max(0, Math.min(1, written - i));
            ctx.globalAlpha = b.alpha * 0.75;
            ctx.fillStyle = palette.accent;
            ctx.fillRect(b.x + bar.x + bar.w * fill, b.y + bar.y - 2.5, 1.8, 8);
          }
        }
      }

      // 3. Render Background Floating Non-Repeating Tech Thoughts & Quotes
      for (const q of activeQuotes) {
        if (q.phase === "type") {
          q.progress = Math.min(1, q.progress + (reduced ? 0.02 : 0.007));
          q.alpha = Math.min(q.maxAlpha, q.alpha + 0.015);
          if (q.progress >= 1) q.phase = "hold";
        } else if (q.phase === "hold") {
          q.holdTimer -= reduced ? 0 : 1;
          if (q.holdTimer <= 0) q.phase = "fade";
        } else if (q.phase === "fade") {
          q.alpha -= 0.005;
          if (q.alpha <= 0) Object.assign(q, makeQuote());
        }

        q.y += q.vy * (reduced ? 0 : 1);

        ctx.globalAlpha = Math.max(0, q.alpha);
        ctx.font = "italic 15px sans-serif";
        ctx.fillStyle = q.color;

        const charCount = Math.floor(q.text.length * q.progress);
        const visibleText = q.text.slice(0, charCount);
        ctx.fillText(visibleText, q.x, q.y);

        if (q.progress > 0.35) {
          ctx.font = "12px monospace";
          ctx.fillStyle = palette.ink;
          ctx.fillText(q.author, q.x + 10, q.y + 20);
        }
      }

      // 4. Render Pointer Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handlePointerMove);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full ${className}`} />;
}
