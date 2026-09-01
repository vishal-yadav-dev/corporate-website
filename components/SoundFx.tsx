"use client";

import { useEffect } from "react";
import { initSfx, playClick, playHover } from "@/lib/sfx";

/** Delegated listeners for anything marked `data-sfx`. Mounted once, renders nothing. */
export default function SoundFx() {
  useEffect(() => {
    initSfx();

    const over = (e: PointerEvent) => {
      // Touch fires pointerover just before click; that would double up on tap.
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest?.("[data-sfx]");
      if (!el) return;
      // Moving between children of the same card is not a new hover.
      if (el.contains(e.relatedTarget as Node | null)) return;
      playHover();
    };

    const click = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.("[data-sfx]")) playClick();
    };

    document.addEventListener("pointerover", over);
    document.addEventListener("click", click);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("click", click);
    };
  }, []);

  return null;
}
