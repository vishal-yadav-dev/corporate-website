"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

const FEATURED_CARDS = [
  {
    slug: "ai-in-the-enterprise",
    tag: "AI & Data",
    title: "AI in the Enterprise",
    excerpt: "Where narrow grounded models win over uncurated data.",
    accent: "#f1531e",
    readTime: "4 min",
  },
  {
    slug: "salesforce-is-no-longer-just-a-crm",
    tag: "Technology",
    title: "Salesforce Beyond CRM",
    excerpt: "Connecting customer experience, data & automation.",
    accent: "#2f97db",
    readTime: "6 min",
  },
  {
    slug: "modernizing-the-public-sector",
    tag: "Industry",
    title: "Public Sector Modernization",
    excerpt: "Building technology for cooperative & state frameworks.",
    accent: "#27b36b",
    readTime: "5 min",
  },
];

export default function BlogHeaderHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), { stiffness: 220, damping: 22 });
  const scale = useSpring(isHovered ? 1.04 : 1, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (dist < 600) {
        const nx = (e.clientX - centerX) / 600;
        const ny = (e.clientY - centerY) / 600;
        mouseX.set(nx);
        mouseY.set(ny);
      } else {
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [mouseX, mouseY]);

  // Auto cycling highlight every 5 seconds if not hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURED_CARDS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <div
      aria-hidden
      className="absolute right-[3%] xl:right-[6%] top-1/2 -translate-y-1/2 z-10 hidden lg:block scene select-none pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="relative preserve-3d group cursor-pointer w-[420px] xl:w-[480px] h-[320px]"
      >
        {/* Prismatic Glowing Ambient Aura */}
        <div className="anim-pulse-glow absolute -inset-20 rounded-full bg-gradient-to-tr from-brand/30 via-accent/25 to-prism-blue/20 blur-[110px] pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity duration-700" />

        {/* 3D Floating Particles */}
        <div className="absolute inset-0 preserve-3d pointer-events-none z-30">
          <span
            className="absolute -top-6 -left-4 h-4 w-4 rounded-full bg-brand/70 blur-[2px] anim-float"
            style={{ transform: "translateZ(70px)", animationDuration: "4s" }}
          />
          <span
            className="absolute -bottom-6 right-8 h-5 w-5 rounded-full bg-prism-blue/60 blur-[3px] anim-float"
            style={{ transform: "translateZ(50px)", animationDuration: "6s", animationDelay: "1s" }}
          />
          <span
            className="absolute top-1/2 -right-6 h-3 w-3 rounded-full bg-prism-amber/80 blur-[1px] anim-float"
            style={{ transform: "translateZ(60px)", animationDuration: "5s", animationDelay: "2s" }}
          />
        </div>

        {/* Stacked Cards */}
        <div className="relative w-full h-full preserve-3d">
          {FEATURED_CARDS.map((card, idx) => {
            const offset = (idx - activeIndex + FEATURED_CARDS.length) % FEATURED_CARDS.length;
            const isTop = offset === 0;

            const zIndex = FEATURED_CARDS.length - offset;
            const translateZ = 40 - offset * 35;
            const translateY = offset * 22;
            const cardScale = 1 - offset * 0.06;
            const opacity = 1 - offset * 0.28;

            return (
              <motion.div
                key={card.slug}
                animate={{
                  transform: `translate3d(0px, ${translateY}px, ${translateZ}px) scale(${cardScale})`,
                  opacity,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  zIndex,
                  transformStyle: "preserve-3d",
                }}
                className={`absolute inset-0 rounded-3xl border ${
                  isTop
                    ? "bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl border-brand/40 shadow-[0_30px_80px_-20px_rgba(242,106,27,0.35)]"
                    : "bg-surface/80 dark:bg-zinc-900/70 backdrop-blur-md border-line shadow-lg"
                } p-7 flex flex-col justify-between overflow-hidden transition-all duration-300`}
                onClick={() => setActiveIndex(idx)}
              >
                {/* Light Sheen Sweep */}
                {isTop && (
                  <span
                    aria-hidden
                    className="plate-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 z-20"
                    style={{
                      background:
                        "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
                    }}
                  />
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="mono-label text-xs px-3 py-1 rounded-full text-white font-medium"
                      style={{ backgroundColor: card.accent }}
                    >
                      {card.tag}
                    </span>
                    <span className="mono-label text-xs text-graphite/70">{card.readTime} read</span>
                  </div>

                  <h3 className="display text-xl xl:text-2xl text-ink mt-4 leading-snug font-bold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-graphite mt-2 line-clamp-2 leading-relaxed">
                    {card.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-line/60">
                  <span className="mono-label text-xs text-accent-deep font-semibold">Featured Article</span>
                  <Link
                    href={`/blog/${card.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs mono-label text-brand font-bold group-hover:translate-x-1 transition-transform"
                  >
                    Read article →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
