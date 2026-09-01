"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import VantaBg from "@/components/VantaBg";

// used only when a banner has no background_fx set, or when there are no banners
const FALLBACK_FX = ["halo", "birds", "net", "dots"] as const;

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_url: string;
  media_id: string | null;
  sort_order: number;
  background_fx: string;
  media_mime_type: string | null;
  media_alt: string | null;
};

export default function Hero({ initialBanners = [] }: { initialBanners?: Banner[] }) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  // Banners rendered on the server need no client fetch, so there is nothing to
  // wait for and no blank hero while we wait for it.
  const [loading, setLoading] = useState(initialBanners.length === 0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (initialBanners.length) return;
    fetch("/api/banners")
      .then((r) => r.json())
      .then((d) => {
        setBanners(d.banners || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // initialBanners is a server-rendered prop; it does not change client-side.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 7000); // auto-rotate every 7s
    return () => clearInterval(interval);
  }, [banners.length]);

  // keep index in range if the banner list changes
  useEffect(() => {
    if (activeIndex >= banners.length && banners.length > 0) setActiveIndex(0);
  }, [banners.length, activeIndex]);

  const slide = banners[activeIndex];
  const heroFx =
    (slide?.background_fx || "").trim() ||
    FALLBACK_FX[activeIndex % FALLBACK_FX.length];

  // Render the title like the signature hero: last word in italic brand colour.
  function renderTitle(title: string) {
    const words = title.trim().split(/\s+/);
    if (words.length < 2) return title;
    const last = words.pop();
    return (
      <>
        {words.join(" ")} <span className="text-brand italic">{last}</span>
      </>
    );
  }

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-between pt-[72px] overflow-hidden group">
      {/* 1. Animated Vanta background — a different effect per slide */}
      <div className="absolute inset-0 z-0 bg-paper">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0"
          >
            {heroFx !== "none" && <VantaBg effect={heroFx as never} />}
          </motion.div>
        </AnimatePresence>
        {/* Reading gradient — keeps the left-side headline readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/85 to-paper/25 z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper to-transparent z-10 pointer-events-none" />
      </div>

      {/* 2. Slide Content */}
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 w-full flex-1 flex flex-col justify-center pb-[14vh] relative z-10">
        <AnimatePresence mode="wait">
          {!loading && banners.length > 0 ? (
            <motion.div
              key={activeIndex}
              /* `false` on the first slide: it is server-rendered, so it must
                 paint at full opacity even if JS never runs. Later slides still
                 cross-fade. */
              initial={activeIndex === 0 ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="py-12"
            >
              <motion.p
                initial={activeIndex === 0 ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mono-label text-accent-deep mb-8"
              >
                Inc. 500 · Enterprise Application Partner
              </motion.p>

              <motion.h1
                initial={activeIndex === 0 ? false : { opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="display text-ink text-[11vw] sm:text-[9vw] lg:text-[7vw] leading-[0.95] max-w-4xl"
              >
                {renderTitle(slide.title)}
              </motion.h1>

              <motion.div
                initial={activeIndex === 0 ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-10 grid lg:grid-cols-[1fr_auto] gap-8 lg:items-end"
              >
                <p className="max-w-xl text-lg sm:text-xl text-graphite leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-3">
                  {slide.cta_url && (
                    <Link
                      href={slide.cta_url}
                      className="group inline-flex items-center gap-2 bg-brand text-white px-6 py-3.5 rounded-full font-medium hover:bg-brand-deep transition-colors"
                    >
                      {slide.cta_text || "Learn More"}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // Original static hero content (fallback when no active banners are in db)
            <motion.div
              key="static-fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mono-label text-accent-deep mb-8"
              >
                Inc. 500 · Enterprise Application Partner
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="display text-ink text-[11vw] sm:text-[9vw] lg:text-[7vw] leading-[0.95] max-w-4xl"
              >
                Enterprise software, <span className="text-brand italic">delivered.</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 grid lg:grid-cols-[1fr_auto] gap-8 lg:items-end"
              >
                <p className="max-w-xl text-lg sm:text-xl text-graphite leading-relaxed">
                  We architect, implement, and run the platforms that keep global enterprises
                  moving — Salesforce, SAP, Oracle, and custom cloud apps.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/practices"
                    className="group inline-flex items-center gap-2 bg-brand text-white px-6 py-3.5 rounded-full font-medium hover:bg-brand-deep transition-colors"
                  >
                    Explore our practices
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Indicators & Manual Controls */}
      {!loading && banners.length > 1 && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-surface/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-line">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveIndex(idx);
              }}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === idx ? "w-6 bg-brand" : "w-2 bg-brand/35 hover:bg-brand/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hover navigation arrows */}
      {!loading && banners.length > 1 && (
        <>
          <button
            onClick={() => {
              setActiveIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 hidden md:grid place-items-center h-12 w-12 rounded-full border border-line bg-surface/85 backdrop-blur-md text-ink hover:bg-brand hover:text-white hover:border-brand transition-all cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <span className="text-xl">←</span>
          </button>
          <button
            onClick={() => {
              setActiveIndex((prev) => (prev + 1) % banners.length);
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 hidden md:grid place-items-center h-12 w-12 rounded-full border border-line bg-surface/85 backdrop-blur-md text-ink hover:bg-brand hover:text-white hover:border-brand transition-all cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <span className="text-xl">→</span>
          </button>
        </>
      )}

    </section>
  );
}
