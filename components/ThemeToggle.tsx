"use client";

import { useTheme, readTheme } from "@/lib/use-theme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();

  function toggle() {
    // Read the live attribute rather than local state: several toggles are
    // mounted at once, and the DOM is what they all agree on.
    const next = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("ns-theme", next); } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`relative h-9 w-9 grid place-items-center rounded-full border border-line-blue/60 text-ink/70 hover:text-brand hover:border-brand transition-colors ${className}`}
    >
      {/* Both icons render; CSS picks one off the root attribute, so the button
          can't paint the wrong glyph for a frame before hydration. */}
      <svg viewBox="0 0 24 24" className="theme-icon-moon h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg viewBox="0 0 24 24" className="theme-icon-sun h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
