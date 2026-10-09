"use client";

import { useState } from "react";

/**
 * Share buttons for an article.
 *
 * The URL is handed in rather than read from `window`: in development the
 * address bar is localhost, and a localhost link is useless to whoever receives
 * it. The copy button copies the same canonical address the share buttons send,
 * so the two can never disagree.
 *
 * What each network accepts differs:
 *  - X and Email take the headline as a parameter, so they fill in immediately.
 *  - LinkedIn and Facebook accept only a URL and read the page's Open Graph
 *    tags themselves, so they preview once that URL is publicly reachable.
 */
export default function ShareLinks({ title, url }: { title: string; url: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const targets = [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.75-1.95 4 0 4.4 2.5 4.4 5.8V21h-4v-5.6c0-1.33-.03-3.05-1.9-3.05-1.9 0-2.2 1.45-2.2 2.95V21h-4V9Z",
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      path: "M17.7 3h3.3l-7.2 8.23L22.3 21h-6.63l-5.2-6.8L4.52 21H1.2l7.7-8.8L1.9 3h6.8l4.7 6.22L17.7 3Zm-1.16 16h1.83L7.55 4.9H5.58L16.54 19Z",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      path: "M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.87.24-1.46 1.5-1.46h1.6V3.96A21 21 0 0 0 14.27 3.8c-2.33 0-3.93 1.42-3.93 4.03V10H7.6v3h2.74v8h3.16Z",
    },
    {
      label: "Email",
      href: `mailto:?subject=${t}&body=${encodeURIComponent(`${title}\n\n${url}`)}`,
      path: "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.7 8-5.2V6.6l-8 5.2-8-5.2v.9l8 5.2Z",
    },
  ];

  /* The Clipboard API is unavailable on an insecure origin and throws when the
     browser refuses, so there is a selection-based fallback behind it. The
     result is always reported: a silent failure looks identical to a success
     and the reader pastes nothing. */
  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    setState(ok ? "copied" : "failed");
    setTimeout(() => setState("idle"), 2200);
  }

  const btn =
    "grid h-8 w-8 place-items-center rounded-full border border-line bg-paper text-ink/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--page-accent,var(--color-brand))]/60 hover:text-[var(--page-accent,var(--color-brand))]";

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="mono-label text-graphite/80">Share</span>

      <div className="flex items-center gap-1.5">
        {targets.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.label === "Email" ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={`Share on ${s.label}`}
            title={`Share on ${s.label}`}
            className={btn}
          >
            <svg viewBox="0 0 24 24" className="h-[0.8125rem] w-[0.8125rem]" fill="currentColor" aria-hidden>
              <path d={s.path} />
            </svg>
          </a>
        ))}

        <button
          type="button"
          onClick={copy}
          aria-label="Copy link"
          title="Copy link"
          className={
            state === "copied"
              ? "grid h-8 w-8 place-items-center rounded-full border border-brand bg-brand text-white transition-all duration-200"
              : state === "failed"
                ? "grid h-8 w-8 place-items-center rounded-full border border-prism-red text-prism-red transition-all duration-200"
                : btn
          }
        >
          <svg viewBox="0 0 24 24" className="h-[0.8125rem] w-[0.8125rem]" fill="currentColor" aria-hidden>
            {state === "copied" ? (
              <path d="M9.6 16.2 4.8 11.4l1.4-1.4 3.4 3.4 8-8 1.4 1.4-9.4 9.4Z" />
            ) : (
              <path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.9-3.9a3 3 0 1 1 4.2 4.3l-2.8 2.8a1 1 0 0 1-1.4-1.4l2.8-2.8a1 1 0 0 0-1.4-1.4l-3.9 3.8a1 1 0 0 1-1.4 0Zm2.8-2.8a1 1 0 0 1 0 1.4l-3.9 3.9a3 3 0 1 1-4.2-4.3l2.8-2.8a1 1 0 1 1 1.4 1.4l-2.8 2.8a1 1 0 0 0 1.4 1.4l3.9-3.8a1 1 0 0 1 1.4 0Z" />
            )}
          </svg>
        </button>
      </div>

      {/* Announced to screen readers and shown to everyone else, so the click
          is confirmed either way rather than appearing to do nothing. */}
      <span
        role="status"
        aria-live="polite"
        className={`mono-label transition-opacity duration-200 ${
          state === "idle" ? "opacity-0" : "opacity-100"
        } ${state === "failed" ? "text-prism-red" : "text-brand"}`}
      >
        {state === "copied" ? "Link copied" : state === "failed" ? "Could not copy" : ""}
      </span>
    </div>
  );
}
