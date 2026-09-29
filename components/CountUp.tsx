"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a numeric value up when it scrolls into view.
 *
 * Values that are not numbers ("Inc.500", "MBE") are rendered as-is, and the
 * final value is what renders on the server — so the number is correct with or
 * without JS, and nothing animates under prefers-reduced-motion.
 */
export default function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const target = match ? parseInt(match[2], 10) : null;

  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (target === null || !ref.current) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const duration = 900;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          // ease-out cubic: fast first, settles on the number
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  const text =
    target !== null && shown !== null ? `${match![1]}${shown}${match![3]}` : value;

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}
