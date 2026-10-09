"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRISM_VAR } from "@/lib/data";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

export type FeaturedPost = {
  slug: string;
  tag: string;
  category?: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  imagePos?: string;
  date: string;
  dateLabel: string;
  minutes: number;
  author: { name: string; role: string };
  accent: number;
};

export default function FeaturedBlogCard({ post }: { post: FeaturedPost }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!cardRef.current || e.pointerType === "touch") return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setTransform(`perspective(1000px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) scale(1.01)`);
    setSpotlightPos({
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    });
  };

  const handleReset = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
    setIsHovered(false);
  };

  const accentColor = PRISM_VAR[post.accent % 6];
  const tagBg = PRISM_BG[post.accent % 6];

  return (
    <div className="relative group">
      {/* Background Ambient Glow */}
      <div
        className="anim-pulse-glow absolute -inset-6 rounded-[2.25rem] bg-gradient-to-r from-brand/25 via-accent/20 to-prism-blue/25 blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      />

      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handleReset}
        onMouseEnter={() => setIsHovered(true)}
        style={{
          transform,
          transformStyle: "preserve-3d",
          "--card-accent": accentColor,
        } as React.CSSProperties}
        className="relative overflow-hidden rounded-[2rem] border border-line bg-surface/95 dark:bg-zinc-900/90 backdrop-blur-xl p-6 sm:p-10 transition-all duration-300 shadow-2xl group-hover:border-[var(--card-accent)]/60 group-hover:shadow-[0_35px_90px_-20px_rgba(242,106,27,0.3)]"
      >
        {/* Dynamic Spotlight Glare */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          style={{
            background: `radial-gradient(700px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255,255,255,0.25), transparent 70%)`,
          }}
        />

        {/* Diagonal Light Sheen */}
        <span
          aria-hidden
          className="plate-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 z-20"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.65) 50%, transparent 100%)",
          }}
        />

        <Link href={`/blog/${post.slug}`} className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:items-center">
          {/* Image Container with Floating Badge */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-line/50 group-hover:border-[var(--card-accent)]/40 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.imageAlt}
              className="media-footage block aspect-[16/10] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.06]"
              style={{ objectPosition: post.imagePos }}
            />

            {/* Gradient Mask Overlay */}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

            {/* Tag Pill */}
            <div className="absolute left-5 top-5 flex items-center gap-2">
              <span className={`rounded-full px-3.5 py-1.5 mono-label text-xs text-white font-medium shadow-md ${tagBg}`}>
                {post.tag}
              </span>
              {post.category && (
                <span className="rounded-full px-3 py-1 mono-label text-xs text-white bg-black/40 backdrop-blur-md border border-white/20">
                  {post.category}
                </span>
              )}
            </div>

            {/* Read Time Overlay */}
            <span className="absolute right-5 bottom-5 rounded-full px-3.5 py-1.5 mono-label text-xs text-white bg-black/50 backdrop-blur-md border border-white/20">
              {post.minutes} min read
            </span>
          </div>

          {/* Content Column */}
          <div className="flex flex-col justify-between h-full py-2">
            <div>
              {/* Featured Header Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs mono-label font-semibold mb-4">
                <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                Featured Story
              </div>

              {/* Title */}
              <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-ink leading-[1.08] font-bold transition-colors group-hover:text-[var(--card-accent)]">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="mt-5 text-graphite text-base sm:text-lg leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            {/* Author & CTA Footer */}
            <div className="mt-8 pt-6 border-t border-line/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Author Avatar Badge */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand to-accent text-white font-bold text-sm grid place-items-center shadow-md">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink leading-tight">{post.author.name}</p>
                  <p className="text-xs text-graphite/70">{post.author.role} · <time dateTime={post.date}>{post.dateLabel}</time></p>
                </div>
              </div>

              <span
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-brand-deep group-hover:shadow-lg group-hover:shadow-brand/25"
              >
                Read Full Article
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
