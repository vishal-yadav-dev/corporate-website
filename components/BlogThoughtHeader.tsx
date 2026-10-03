"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TECH_QUOTES = [
  {
    quote: "Technology is best when it brings people together and turns complex problems into elegant solutions.",
    author: "Matt Mullenweg",
    role: "Founder, WordPress & Automattic",
    tag: "Human-Centered Tech",
  },
  {
    quote: "Simplicity is prerequisite for reliability. Build platforms that endure, not just systems that launch.",
    author: "Edsger W. Dijkstra",
    role: "Turing Award Winner & Computer Scientist",
    tag: "Engineering Craft",
  },
  {
    quote: "Any sufficiently advanced technology is indistinguishable from magic when built with precision and intent.",
    author: "Arthur C. Clarke",
    role: "Futurist & Author",
    tag: "Innovation",
  },
  {
    quote: "First, solve the problem with real clarity. Then, write the architecture to scale it.",
    author: "John Johnson",
    role: "Software Architect",
    tag: "System Design",
  },
  {
    quote: "The best way to predict the future of enterprise software is to invent and modernize it today.",
    author: "Alan Kay",
    role: "Pioneer in Object-Oriented Programming",
    tag: "Future of Work",
  },
];

export default function BlogThoughtHeader() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto rotation every 6 seconds if user is not hovering
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TECH_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const current = TECH_QUOTES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TECH_QUOTES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TECH_QUOTES.length) % TECH_QUOTES.length);
  };

  return (
    <div
      aria-hidden
      className="absolute right-[3%] xl:right-[6%] top-1/2 -translate-y-1/2 z-10 hidden lg:block select-none pointer-events-auto w-[420px] xl:w-[480px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Ambient Prismatic Atmosphere Glow */}
        <div className="anim-pulse-glow absolute -inset-16 rounded-full bg-gradient-to-tr from-brand/25 via-accent/20 to-prism-blue/25 blur-[100px] pointer-events-none" />

        {/* Floating Glass Card for Thoughts & Quotes */}
        <div className="relative overflow-hidden rounded-3xl bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl p-8 border border-white/50 dark:border-white/10 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.35)] dark:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
          {/* Animated Light Sheen Sweep */}
          <span
            aria-hidden
            className="plate-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 z-20"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
            }}
          />

          {/* Large Decorative Quote Icon */}
          <span className="absolute -top-4 -right-2 text-7xl font-serif text-brand/15 select-none pointer-events-none leading-none">
            “
          </span>

          <div className="relative z-10 min-h-[190px] flex flex-col justify-between">
            {/* Tag Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs mono-label font-semibold">
                <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                {current.tag}
              </span>

              {/* Navigation Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  aria-label="Previous quote"
                  className="h-7 w-7 rounded-full bg-paper hover:bg-paper-tint border border-line flex items-center justify-center text-xs text-graphite hover:text-ink transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next quote"
                  className="h-7 w-7 rounded-full bg-paper hover:bg-paper-tint border border-line flex items-center justify-center text-xs text-graphite hover:text-ink transition-colors"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Quote Body Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="my-4"
              >
                <p className="text-lg xl:text-xl text-ink font-medium leading-relaxed italic">
                  "{current.quote}"
                </p>
                <div className="mt-4 pt-3 border-t border-line/50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-ink leading-tight">{current.author}</p>
                    <p className="text-xs text-graphite/70 mt-0.5">{current.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {TECH_QUOTES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-6 bg-brand" : "w-1.5 bg-graphite/30 hover:bg-graphite/60"
                  }`}
                  aria-label={`Go to quote ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
