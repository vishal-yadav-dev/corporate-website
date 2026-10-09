"use client";

import { useEffect } from "react";

/**
 * Makes "#form" actually land somewhere a reader can see.
 *
 * Three cases, and only the first worked on its own:
 *   - arriving from another page: the browser scrolls to the anchor itself;
 *   - already on this page with no hash: the click sets it and the browser
 *     scrolls, but a fixed header can leave the form half under it;
 *   - already on this page *with* the hash: clicking again changes nothing at
 *     all, so the button appears dead.
 *
 * So same-page clicks are intercepted and scrolled here, and the form is given
 * a brief ring afterwards — on a long page a silent jump is easy to miss.
 */
export default function FormFocus({ targetId = "form" }: { targetId?: string }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveal = () => {
      const el = document.getElementById(targetId);
      if (!el) return;
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      /* the flash is what says "this is the thing you asked for" */
      el.classList.add("ring-flash");
      window.setTimeout(() => el.classList.remove("ring-flash"), 1400);
      /* move focus for keyboard and screen-reader users, without stealing the
         viewport back from the smooth scroll */
      const field = el.querySelector<HTMLElement>("input, textarea, select");
      field?.focus({ preventScroll: true });
    };

    if (window.location.hash === `#${targetId}`) {
      /* after paint, or the layout is not settled and the scroll lands short */
      window.requestAnimationFrame(() => window.setTimeout(reveal, 60));
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (!href.endsWith(`#${targetId}`)) return;
      /* same document: the router will not move, so do it here */
      e.preventDefault();
      history.replaceState(null, "", `#${targetId}`);
      reveal();
    };

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", reveal);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", reveal);
    };
  }, [targetId]);

  return null;
}
