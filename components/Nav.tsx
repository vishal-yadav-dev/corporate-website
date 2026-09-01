"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NAV } from "@/lib/data";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-paper/85 backdrop-blur-xl border-b border-line" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobile(false)}>
            <span className="h-8 w-8 grid place-items-center bg-brand text-white font-display font-bold text-lg rounded-[6px] group-hover:rotate-6 transition-transform">
              N
            </span>
            <span className="display text-ink text-xl tracking-tight">Testsoft</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setOpen(null)}>
            {NAV.map((item) => (
              <div key={item.label} className="relative" onMouseEnter={() => setOpen(item.label)}>
                <Link href={item.href} className="px-4 py-2 text-sm text-ink/70 hover:text-brand transition-colors mono-label">
                  {item.label}
                </Link>
                <AnimatePresence>
                  {item.children.length > 0 && open === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.16 }}
                      className="absolute top-full left-0 pt-3"
                    >
                      <div className="min-w-[220px] bg-surface border border-line rounded-xl p-2 shadow-xl shadow-brand/5">
                        {item.children.map((c) => (
                          <Link key={c.label} href={c.href} className="block px-3 py-2 text-sm text-ink/70 hover:text-brand hover:bg-paper-tint rounded-lg transition-colors">
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/contact" className="group inline-flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-deep transition-colors">
              Start a project
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button aria-label="Toggle menu" onClick={() => setMobile((m) => !m)} className="h-10 w-10 grid place-items-center text-ink">
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-ink transition-transform ${mobile ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-ink transition-opacity ${mobile ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-ink transition-transform ${mobile ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-paper pt-[72px] lg:hidden overflow-y-auto">
            <div className="px-6 py-8 space-y-6">
              {NAV.map((item) => (
                <div key={item.label} className="border-b border-line pb-5">
                  <Link href={item.href} onClick={() => setMobile(false)} className="display text-3xl text-ink block mb-3">
                    {item.label}
                  </Link>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {item.children.map((c) => (
                      <Link key={c.label} href={c.href} onClick={() => setMobile(false)} className="text-sm text-graphite hover:text-brand">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <Link href="/contact" onClick={() => setMobile(false)} className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-full font-medium">
                Start a project →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
