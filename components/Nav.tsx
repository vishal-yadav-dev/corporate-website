"use client";

import Wordmark from "@/components/Wordmark";
import { Fragment, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NAV } from "@/lib/data";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  /* The plain menus are absolute, so they hang from `top-full` of their nav
     item. The rich one is fixed (it has to be, to centre on the viewport rather
     than on the leftmost word), and fixed cannot read `top-full`. So the item
     row is measured once and the rich panel is pinned to the same line. A
     hardcoded offset was what put it ~19px lower than the rest. */
  const navRef = useRef<HTMLElement>(null);
  const [menuTop, setMenuTop] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  useEffect(() => {
    const measure = () => {
      const r = navRef.current?.getBoundingClientRect();
      if (r) setMenuTop(r.bottom);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-paper/85 backdrop-blur-xl border-b border-line" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 flex items-center justify-between h-18">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobile(false)}>
            <Wordmark size="md" />
          </Link>

          <nav ref={navRef} className="hidden lg:flex items-center gap-1" onMouseLeave={() => setOpen(null)}>
            {NAV.map((item) => {
              const rich = item.groups?.some((g) => g.items.some((c) => c.desc)) ?? false;
              return (
              <div key={item.label} className="relative" onMouseEnter={() => setOpen(item.label)}>
                <Link href={item.href} className="px-4 py-2 text-ink/70 hover:text-brand transition-colors mono-label">
                  {item.label}
                </Link>
                <AnimatePresence>
                  {item.children.length > 0 && open === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.16 }}
                      /* The rich panel is centred on the viewport rather than
                         on its trigger. Centring on the item works for a
                         mid-nav word, but About Us is the leftmost one and a
                         1080px panel hung off the left edge of the screen.
                         Fixed positioning is safe here: the panel is still a
                         DOM child of the nav, so moving onto it does not fire
                         the nav's mouseleave.

                         The other wide menus (three plain columns, ~800px)
                         still centre under theirs.

                         Its top is measured from the item row rather than set
                         to the bar height, so it opens on the same line as the
                         plain menus instead of below them. */
                      style={rich ? { top: menuTop } : undefined}
                      className={
                        rich
                          ? "fixed left-1/2 -translate-x-1/2 pt-3"
                          : `absolute top-full pt-3 ${
                              (item.groups?.length ?? 0) >= 3 ? "left-1/2 -translate-x-1/2" : "left-0"
                            }`
                      }
                    >
                      {item.groups?.some((g) => g.items.some((c) => c.desc)) ? (
                        /* Rich layout: each entry says what is behind it, so
                           the reader does not have to open a page to find out.
                           Columns are divided by a rule rather than by a
                           heading — the entry titles are the structure. */
                        <div
                          className="relative overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-xl shadow-brand/5"
                          style={{ width: "min(67.5rem, calc(100vw - 3rem))" }}
                        >
                          <span aria-hidden className="prism-wash pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-prism-blue blur-[80px]" />
                          <span aria-hidden className="prism-wash pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-prism-violet blur-[80px]" />
                          <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 divide-x divide-line">
                            {item.groups.map((g) => (
                              <div key={g.title} className="px-4 divide-y divide-line">
                                <h3 className="sr-only">{g.title}</h3>
                                {g.items.map((c) => (
                                  <Link
                                    key={c.label}
                                    href={c.href}
                                    className="group/i block rounded-xl px-3 py-4 hover:bg-paper-tint transition-colors"
                                  >
                                    <span className="display block text-lg text-ink group-hover/i:text-brand transition-colors">
                                      {c.label}
                                    </span>
                                    {c.desc && (
                                      <span className="mt-2 block text-sm text-graphite leading-relaxed">{c.desc}</span>
                                    )}
                                    <span className="mt-3 inline-flex items-center gap-2 mono-label text-accent-deep group-hover/i:text-brand transition-colors">
                                      Learn More
                                      <span aria-hidden className="transition-transform duration-300 group-hover/i:translate-x-1">→</span>
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : item.groups ? (
                        /* A grid of two rows, not a row of columns: the headers
                           all sit in the first row, so that row is as tall as
                           the tallest of them and every underline lands on the
                           same line. Columns each sized their own header before,
                           and a title that wrapped to two lines dropped its rule
                           below the others. */
                        <div
                          className="relative overflow-hidden grid grid-flow-col auto-cols-[minmax(13.4375rem,1fr)] xl:auto-cols-[minmax(15.5rem,1fr)] gap-x-14 xl:gap-x-16 gap-y-0 bg-surface border border-line rounded-2xl p-6 shadow-xl shadow-brand/5"
                          style={{ gridTemplateRows: "auto 1fr" }}
                        >
                          {/* a little colour under the panel so it is not a flat
                              slab; both ride --wash, so they hold up on white */}
                          <span aria-hidden className="prism-wash pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-prism-blue blur-[80px]" />
                          <span aria-hidden className="prism-wash pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-prism-violet blur-[80px]" />
                          {item.groups.map((g) => (
                            <Fragment key={g.title}>
                              <p className="relative menu-group-label text-accent-deep pl-1 pr-3 pb-2.5 border-b border-line self-end">{g.title}</p>
                              <div className="relative pt-2">
                                {g.items.map((c) => (
                                  <Link
                                    key={c.label}
                                    href={c.href}
                                    className="group/i flex items-center justify-between gap-4 pl-1 pr-3 py-2 text-[0.95rem] text-ink/70 hover:text-brand hover:bg-paper-tint rounded-lg transition-colors"
                                  >
                                    {c.label}
                                    <span className="opacity-0 -translate-x-1 group-hover/i:opacity-100 group-hover/i:translate-x-0 transition-all duration-200">→</span>
                                  </Link>
                                ))}
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      ) : (
                        <div className="min-w-[13.75rem] bg-surface border border-line rounded-xl p-2 shadow-xl shadow-brand/5">
                          {item.children.map((c) => (
                            <Link key={c.label} href={c.href} className="block px-3 py-2 text-[0.95rem] text-ink/70 hover:text-brand hover:bg-paper-tint rounded-lg transition-colors">
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/contact#form" className="group inline-flex items-center gap-2 btn-cta bg-brand text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-deep transition-colors">
              Talk to an Expert
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-paper pt-18 lg:hidden overflow-y-auto">
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
              <Link href="/contact#form" onClick={() => setMobile(false)} className="inline-flex items-center gap-2 btn-cta bg-brand text-white px-6 py-3 rounded-full font-medium">
                Talk to an Expert →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
