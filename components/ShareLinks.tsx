"use client";

import { useState } from "react";

export default function ShareLinks({
  title,
  url,
  bodyText,
}: {
  title: string;
  url: string;
  bodyText?: string;
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

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

  const handleCopyLink = async () => {
    try {
      const linkToCopy = typeof window !== "undefined" ? window.location.href : url;
      await navigator.clipboard.writeText(linkToCopy);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      /* fallback */
    }
  };

  const handleCopyContent = async () => {
    try {
      const textToCopy = bodyText || `${title}\n\n${url}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } catch {
      /* fallback */
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-line bg-surface p-7 sm:p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-20 -bottom-20 h-52 w-52 rounded-full opacity-[0.14] blur-[90px]"
        style={{ background: "var(--page-accent, var(--color-brand))" }}
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mono-label label-accent">Share & Copy Article</p>
          <p className="mt-2 text-sm text-graphite">Pass it on or copy the link/content for your team.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {targets.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.label === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={`Share on ${s.label}`}
              className="group inline-flex h-11 items-center gap-2.5 rounded-full border border-line bg-paper px-4 text-ink/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--page-accent,var(--color-brand))]/60 hover:text-[var(--page-accent,var(--color-brand))] hover:shadow-card"
            >
              <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] shrink-0" fill="currentColor" aria-hidden>
                <path d={s.path} />
              </svg>
              <span className="mono-label text-xs">{s.label}</span>
            </a>
          ))}

          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            aria-live="polite"
            className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 transition-all duration-300 hover:-translate-y-0.5 shadow-sm ${
              copiedLink
                ? "border-brand bg-brand/10 text-brand font-bold"
                : "border-line bg-paper text-ink/75 hover:border-[var(--page-accent,var(--color-brand))]/60 hover:text-[var(--page-accent,var(--color-brand))]"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] shrink-0" fill="currentColor" aria-hidden>
              <path d="M10.59 13.41a1 1 0 0 1 0-1.42l3.88-3.88a3 3 0 1 1 4.24 4.24l-2.83 2.83a1 1 0 0 1-1.42-1.42l2.83-2.83a1 1 0 0 0-1.42-1.42l-3.88 3.88a1 1 0 0 1-1.42 0zM13.41 10.59a1 1 0 0 1 0 1.42l-3.88 3.88a3 3 0 1 1-4.24-4.24l2.83-2.83a1 1 0 0 1 1.42 1.42L6.71 13.1a1 1 0 0 0 1.42 1.42l3.88-3.88a1 1 0 0 1 1.42 0z" />
            </svg>
            <span className="mono-label text-xs">{copiedLink ? "Link Copied! ✓" : "Copy Link"}</span>
          </button>

          {/* Copy Content Button */}
          <button
            type="button"
            onClick={handleCopyContent}
            aria-live="polite"
            className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 transition-all duration-300 hover:-translate-y-0.5 shadow-sm ${
              copiedContent
                ? "border-accent-deep bg-accent-deep/10 text-accent-deep font-bold"
                : "border-line bg-paper text-ink/75 hover:border-brand/60 hover:text-brand"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] shrink-0" fill="currentColor" aria-hidden>
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
            <span className="mono-label text-xs">{copiedContent ? "Content Copied! ✓" : "Copy Content"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

