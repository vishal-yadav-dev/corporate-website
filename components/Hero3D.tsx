"use client";

import { useEffect, useRef } from "react";

const PRISM = ["#E5352F", "#F1531E", "#F5A623", "#27B36B", "#2F97DB", "#7E5BE6"];
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Hero decoration — a rotating 3D point cloud with a glowing core and a few
 * connective struts. Reacts subtly to the pointer. No WebGL.
 */
export default function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        el.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${(x * 14).toFixed(2)}deg`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  const dots = Array.from({ length: 60 }, (_, i) => ({
    x: (rand(i + 1) - 0.5) * 460,
    y: (rand(i + 17) - 0.5) * 460,
    z: (rand(i + 41) - 0.5) * 460,
    s: 3 + rand(i + 61) * 6,
    c: PRISM[i % PRISM.length],
  }));

  return (
    <div className="scene pointer-events-none select-none w-full h-full grid place-items-center" aria-hidden>
      <div
        ref={ref}
        className="preserve-3d"
        style={{
          width: "min(48vw, 480px)",
          height: "min(48vw, 480px)",
          transform: "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
          transition: "transform 0.4s ease-out",
        }}
      >
        <div className="preserve-3d anim-spin-3d absolute inset-0 grid place-items-center">
          <div className="preserve-3d relative anim-float">
            {dots.map((d, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{
                  width: d.s,
                  height: d.s,
                  background: d.c,
                  boxShadow: `0 0 ${d.s * 2.2}px ${d.c}`,
                  transform: `translate3d(${d.x}px, ${d.y}px, ${d.z}px)`,
                }}
              />
            ))}
          </div>
        </div>
        {/* glowing core */}
        <div
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full anim-drift"
          style={{
            background: "radial-gradient(circle at 40% 35%, #FF9A4A, #C24E12 55%, transparent 72%)",
            boxShadow: "0 0 100px 12px rgba(242,106,27,0.42)",
          }}
        />
      </div>
    </div>
  );
}
