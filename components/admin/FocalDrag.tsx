"use client";

import { useRef, useState } from "react";

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/* Arrow keys move the picture the way a drag does, a little at a time. */
const NUDGE: Record<string, [number, number]> = {
  ArrowLeft: [2, 0], ArrowRight: [-2, 0], ArrowUp: [0, 2], ArrowDown: [0, -2],
};

/**
 * A cropped picture that can be dragged to choose which part of it shows.
 *
 * The frame crops with `object-fit: cover` and the position is the pair of
 * percentages `object-position` takes, so what is dragged here is exactly what
 * the page renders and there is no second crop to keep in step with it. It
 * follows the pointer while it moves and reports once, on release.
 *
 * Renders the image and a hint. The parent is the frame: it has to be
 * positioned, and `className` gives the picture its shape.
 */
export default function FocalDrag({
  src,
  alt = "",
  x,
  y,
  className = "",
  onChange,
}: {
  src: string;
  alt?: string;
  /** 0-100 on each axis; 50 and 50 is centred */
  x: number;
  y: number;
  className?: string;
  onChange: (x: number, y: number) => void;
}) {
  const start = useRef<{ px: number; py: number; x: number; y: number; ox: number; oy: number } | null>(null);
  // The release handler reads this, not the state, which may be a move behind.
  const latest = useRef<{ x: number; y: number } | null>(null);
  const [live, setLive] = useState<{ x: number; y: number } | null>(null);
  const at = live ?? { x, y };

  function down(e: React.PointerEvent<HTMLImageElement>) {
    const el = e.currentTarget;
    if (e.button !== 0 || !el.naturalWidth) return;
    const box = el.getBoundingClientRect();
    /* How far the scaled picture overhangs the frame on each axis. That is all
       there is to drag through; an axis with no overhang has nothing hidden. */
    const scale = Math.max(box.width / el.naturalWidth, box.height / el.naturalHeight);
    start.current = {
      px: e.clientX, py: e.clientY, x: at.x, y: at.y,
      ox: el.naturalWidth * scale - box.width,
      oy: el.naturalHeight * scale - box.height,
    };
    el.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function move(e: React.PointerEvent<HTMLImageElement>) {
    const s = start.current;
    if (!s) return;
    latest.current = {
      x: s.ox > 1 ? clamp(s.x - ((e.clientX - s.px) / s.ox) * 100) : s.x,
      y: s.oy > 1 ? clamp(s.y - ((e.clientY - s.py) / s.oy) * 100) : s.y,
    };
    setLive(latest.current);
  }

  function end() {
    if (!start.current) return;
    start.current = null;
    const to = latest.current;
    latest.current = null;
    if (to) onChange(Math.round(to.x), Math.round(to.y));
    setLive(null);
  }

  function key(e: React.KeyboardEvent<HTMLImageElement>) {
    const by = NUDGE[e.key];
    if (!by) return;
    e.preventDefault();
    onChange(clamp(x + by[0]), clamp(y + by[1]));
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        title="Drag, or use the arrow keys, to choose which part of the picture shows"
        draggable={false}
        tabIndex={0}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onKeyDown={key}
        className={`${className} cursor-grab touch-none select-none active:cursor-grabbing`}
        style={{ objectPosition: `${at.x}% ${at.y}%` }}
      />
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] text-white">
        Drag to reposition
      </span>
    </>
  );
}
