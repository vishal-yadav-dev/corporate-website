"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

/** Source of truth is <html data-theme>, set by the inline script in the root layout. */
export function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

/**
 * Current theme, kept in sync across every consumer by watching the attribute
 * itself — so a toggle in one place updates the icon in another, and canvases
 * that bake in colours at init can rebuild when it flips.
 */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readTheme());
    const mo = new MutationObserver(() => setTheme(readTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  return theme;
}
