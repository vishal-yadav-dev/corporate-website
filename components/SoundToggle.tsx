"use client";

import { useEffect, useState } from "react";
import { readSfx, setSfxOn, subscribeSfx } from "@/lib/sfx";

export default function SoundToggle({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(false);

  // Several toggles are mounted at once (desktop + mobile nav); the store keeps
  // every one of them in step.
  useEffect(() => {
    setOn(readSfx());
    return subscribeSfx(setOn);
  }, []);

  return (
    <button
      onClick={() => setSfxOn(!on)}
      aria-label={on ? "Turn interface sounds off" : "Turn interface sounds on"}
      aria-pressed={on}
      className={`relative h-9 w-9 grid place-items-center rounded-full border transition-colors ${
        on ? "border-brand text-brand" : "border-line-blue/60 text-ink/70 hover:text-brand hover:border-brand"
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        {on ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <path d="M16 9.5 21 14.5M21 9.5 16 14.5" />
        )}
      </svg>
    </button>
  );
}
