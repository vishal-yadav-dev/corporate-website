"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PRISM_VAR } from "@/lib/data";
import { getCategoryForTag, type BlogCategory } from "@/lib/blog";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

export type BlogCard = {
  slug: string;
  tag: string;
  category?: BlogCategory;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  date: string;
  dateLabel: string;
  minutes: number;
  accent: number;
};

const STEP = 9;

export default function BlogList({ items }: { items: BlogCard[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [shown, setShown] = useState(STEP);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: items.length, Industry: 0, Technology: 0, Solutions: 0 };
    for (const item of items) {
      const cat = getCategoryForTag(item.tag, item.category);
      if (cat in counts) counts[cat as keyof typeof counts]++;
    }
    return counts;
  }, [items]);

  // Dynamic list of tags based on selected category
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    for (const item of items) {
      const cat = getCategoryForTag(item.tag, item.category);
      if (selectedCategory === "All" || cat === selectedCategory) {
        if (item.tag) tagsSet.add(item.tag);
      }
    }
    return ["All", ...Array.from(tagsSet)];
  }, [items, selectedCategory]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const cat = getCategoryForTag(item.tag, item.category);
      // Category match
      if (selectedCategory !== "All" && cat !== selectedCategory) return false;
      // Tag match
      if (selectedTag !== "All" && item.tag !== selectedTag) return false;
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesExcerpt = item.excerpt.toLowerCase().includes(q);
        const matchesTag = item.tag.toLowerCase().includes(q);
        if (!matchesTitle && !matchesExcerpt && !matchesTag) return false;
      }
      return true;
    });
  }, [items, selectedCategory, selectedTag, searchQuery]);

  const visible = filteredItems.slice(0, shown);
  const remaining = filteredItems.length - visible.length;

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedTag("All");
    setShown(STEP);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setShown(STEP);
  };

  return (
    <div className="space-y-8">
      {/* Category Tabs & Search Bar */}
      <div className="rounded-3xl border border-line bg-surface/90 backdrop-blur-md p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-line">
          {/* Main Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Industry", "Technology", "Solutions"].map((cat) => {
              const isActive = selectedCategory === cat;
              const count = categoryCounts[cat as keyof typeof categoryCounts] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-brand text-white shadow-md shadow-brand/25 scale-[1.02]"
                      : "bg-paper hover:bg-paper-tint text-graphite hover:text-ink border border-line/60"
                  }`}
                >
                  <span>{cat === "All" ? "All Articles" : cat}</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      isActive ? "bg-white/20 text-white" : "bg-surface-tint text-graphite/80"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Real-time Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShown(STEP);
              }}
              placeholder="Search articles & topics..."
              className="w-full rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-graphite hover:text-ink p-1"
              >
                ✕
              </button>
            ) : (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-graphite/40 pointer-events-none">
                🔍
              </span>
            )}
          </div>
        </div>

        {/* Topic Tag Pills */}
        {availableTags.length > 2 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono-label text-xs text-graphite/70 mr-1">Filter by Topic:</span>
            {availableTags.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-ink text-paper shadow-sm"
                      : "bg-paper/70 hover:bg-paper text-graphite hover:text-ink border border-line/40"
                  }`}
                >
                  {tag === "All" ? "All Topics" : tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Filter Summary */}
      <div className="flex items-center justify-between text-xs mono-label text-graphite px-2">
        <div>
          Showing {visible.length} of {filteredItems.length} articles
          {selectedCategory !== "All" && <span className="text-brand font-semibold"> in {selectedCategory}</span>}
          {selectedTag !== "All" && <span className="text-accent-deep"> ({selectedTag})</span>}
          {searchQuery && <span> matching "{searchQuery}"</span>}
        </div>
        {(selectedCategory !== "All" || selectedTag !== "All" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedTag("All");
              setSearchQuery("");
              setShown(STEP);
            }}
            className="text-brand hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid of Filtered Cards */}
      {visible.length > 0 ? (
        <motion.div layout className="grid gap-6 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--card-accent)]/60 hover:shadow-xl"
                  style={{ "--card-accent": PRISM_VAR[p.accent % 6] } as React.CSSProperties}
                >
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="media-footage block aspect-[16/10] w-full object-cover transition-transform duration-[1.1s] group-hover:scale-[1.07]"
                    />
                    <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 mono-label text-white text-xs ${PRISM_BG[p.accent % 6]}`}>
                      {p.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="display text-xl sm:text-2xl text-ink leading-tight transition-colors group-hover:text-[var(--card-accent)]">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm text-graphite leading-relaxed line-clamp-3">{p.excerpt}</p>
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-line/50">
                      <p className="mono-label text-xs text-graphite/80">
                        <time dateTime={p.date}>{p.dateLabel}</time> · {p.minutes} min
                      </p>
                      <span className="inline-flex items-center gap-1 mono-label text-xs font-semibold" style={{ color: "var(--card-accent)" }}>
                        Read
                        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="py-16 text-center rounded-3xl border border-line bg-surface/50 p-8">
          <p className="display text-2xl text-ink">No articles match your selection</p>
          <p className="mt-2 text-graphite text-sm">Try choosing a different category, topic, or search keyword.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedTag("All");
              setSearchQuery("");
            }}
            className="mt-6 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {remaining > 0 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="mono-label text-graphite/80" aria-live="polite">
            Showing {visible.length} of {filteredItems.length}
          </p>
          <button
            type="button"
            onClick={() => setShown((n) => n + STEP)}
            className="group inline-flex items-center gap-3 btn-cta rounded-full bg-brand px-7 py-3.5 font-medium text-white transition-colors hover:bg-brand-deep shadow-md hover:shadow-lg"
          >
            Load {Math.min(STEP, remaining)} more
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
          </button>
        </div>
      )}
    </div>
  );
}
