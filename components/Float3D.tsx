"use client";

import { useRef } from "react";

/**
 * An image held in space rather than laid flat on the page.
 *
 * Four nested layers, each owning one transform so they compose instead of
 * fighting: perspective, a vertical float, a slow yaw, and the pointer tilt.
 * The first three are CSS keyframes the compositor runs on its own; only the
 * tilt touches JavaScript, and it writes through requestAnimationFrame so a
 * fast pointer cannot queue more work than a frame can spend.
 *
 * Touch devices never get the tilt — there is no hover there to reveal it, and
 * the listeners would only cost battery.
 */
export default function Float3D({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const tilt = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = tilt.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    /* -0.5 .. 0.5 from the centre of the frame. */
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `rotateY(${px * 16}deg) rotateX(${-py * 12}deg)`;
    });
  }

  function onLeave() {
    cancelAnimationFrame(frame.current);
    const el = tilt.current;
    if (el) el.style.transform = "";
  }

  return (
    <div
      className={`scene ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="preserve-3d anim-float">
        <div className="preserve-3d anim-sway">
          <div
            ref={tilt}
            className="preserve-3d relative"
            style={{ transition: "transform .5s cubic-bezier(.22,1,.36,1)" }}
          >
            {/* The glow sits behind the plate and picks up the same tilt, so the
                light appears to belong to the object. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-10 rounded-full bg-brand/20 blur-[70px]"
              style={{ transform: "translateZ(-60px)" }}
            />
            <div
              className="relative overflow-hidden rounded-2xl border border-line-blue/60 bg-surface"
              style={{ boxShadow: "0 40px 90px -40px rgba(0,0,0,0.85)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} loading="lazy" decoding="async" className="block w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
