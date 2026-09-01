"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/use-theme";

type Effect =
  | "waves" | "rings" | "net" | "globe" | "fog" | "halo" | "dots" | "cells" | "birds"
  | "clouds" | "clouds2" | "topology" | "trunk";

const LOADERS: Record<Effect, () => Promise<unknown>> = {
  waves: () => import("vanta/dist/vanta.waves.min"),
  rings: () => import("vanta/dist/vanta.rings.min"),
  net: () => import("vanta/dist/vanta.net.min"),
  globe: () => import("vanta/dist/vanta.globe.min"),
  fog: () => import("vanta/dist/vanta.fog.min"),
  halo: () => import("vanta/dist/vanta.halo.min"),
  dots: () => import("vanta/dist/vanta.dots.min"),
  cells: () => import("vanta/dist/vanta.cells.min"),
  birds: () => import("vanta/dist/vanta.birds.min"),
  clouds: () => import("vanta/dist/vanta.clouds.min"),
  clouds2: () => import("vanta/dist/vanta.clouds2.min"),
  topology: () => import("vanta/dist/vanta.topology.min"),
  trunk: () => import("vanta/dist/vanta.trunk.min"),
};

/** effects that render with p5 instead of three */
const P5_EFFECTS = new Set<Effect>(["topology", "trunk"]);

/**
 * WebGL / p5 animated background (Vanta.js). Loads lazily on the client, cleans
 * up on unmount, respects prefers-reduced-motion.
 */
export default function VantaBg({
  effect = "waves",
  className = "",
  options = {},
  fixed = false,
}: {
  effect?: Effect;
  className?: string;
  options?: Record<string, unknown>;
  /** pin to the viewport instead of the parent (full-page background) */
  fixed?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const optKey = JSON.stringify(options);
  // Colours are baked in at init, so a theme flip has to rebuild the scene.
  const theme = useTheme();
  // Skip WebGL/p5 entirely on phones & low-power / reduced-motion devices.
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const heavyOk =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(min-width: 900px) and (pointer: fine)").matches &&
      (navigator.hardwareConcurrency ?? 8) >= 4 &&
      // @ts-expect-error deviceMemory is non-standard
      (navigator.deviceMemory ?? 8) >= 4;
    setEnabled(heavyOk);
  }, []);

  // Only run while near the viewport (saves GPU when several are on a page).
  const [near, setNear] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => setNear(e.isIntersecting),
      { rootMargin: "300px 0px 300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !near) return;

    let vanta: { destroy: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const usesP5 = P5_EFFECTS.has(effect);
      const [engineMod, mod] = await Promise.all([
        usesP5 ? import("p5") : import("three"),
        LOADERS[effect](),
      ]);
      if (cancelled) return;

      const em = engineMod as { default?: unknown };
      // three's ESM build has no default; p5's has. Pick whichever looks usable.
      const engine =
        em.default && (typeof em.default === "function" || (em.default as { WebGLRenderer?: unknown }).WebGLRenderer)
          ? em.default
          : engineMod;
      const factory = ((mod as { default?: unknown }).default ?? mod) as
        | ((o: Record<string, unknown>) => { destroy: () => void })
        | undefined;
      if (typeof factory !== "function") return;

      // Vanta falls back to window.THREE / window.p5 — make sure they're there.
      const w = window as unknown as Record<string, unknown>;
      if (usesP5) w.p5 = w.p5 ?? engine;
      else w.THREE = w.THREE ?? engine;

      const light = theme === "light";

      vanta = factory({
        el,
        ...(usesP5 ? { p5: engine } : { THREE: engine }),
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        ...defaults(effect, light),
        // match the page background so the canvas blends instead of forming a band
        backgroundColor: light ? 0xffffff : 0x050608,
        ...(light ? { color: 0xe2481b, color2: 0x1e88c7 } : {}),
        ...JSON.parse(optKey || "{}"),
      });
    })().catch((e) => console.warn("Vanta init failed:", effect, e));

    return () => {
      cancelled = true;
      try { vanta?.destroy(); } catch {}
    };
  }, [effect, optKey, enabled, near, theme]);

  // Lightweight CSS fallback on mobile / reduced-motion — a soft prism wash.
  return (
    <div
      ref={ref}
      aria-hidden
      className={`${fixed ? "fixed" : "absolute"} inset-0 ${className}`}
      style={
        enabled
          ? undefined
          : {
              backgroundImage:
                "radial-gradient(60% 60% at 80% 10%, color-mix(in srgb, var(--color-brand) 14%, transparent), transparent 70%), radial-gradient(55% 55% at 10% 100%, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 70%)",
            }
      }
    />
  );
}

/* Brand-tuned defaults per effect (Noblesoft prism, per theme).
   Effects keyed on `color`/`color2` are re-tinted by the caller; the ones with
   their own colour vocabulary (fog, clouds, cells) need both palettes here or
   they stay night-coloured on a white page. */
function defaults(effect: Effect, light: boolean): Record<string, unknown> {
  switch (effect as string) {
    case "waves":
      return { color: light ? 0xd7e3ef : 0x141a24, shininess: 24, waveHeight: 13, waveSpeed: 0.8, zoom: 0.9 };
    case "rings":
      return { backgroundColor: 0x050608, color: 0xf1531e };
    case "net":
      return { backgroundColor: 0x050608, color: 0x2f97db, points: 10, maxDistance: 22, spacing: 18 };
    case "globe":
      return { backgroundColor: 0x050608, color: 0xf1531e, color2: 0x2f97db, size: 0.9 };
    case "fog":
      return light
        ? { highlightColor: 0xe2481b, midtoneColor: 0x6b49d6, lowlightColor: 0x1e88c7, baseColor: 0xffffff, blurFactor: 0.6 }
        : { highlightColor: 0xf1531e, midtoneColor: 0x7e5be6, lowlightColor: 0x2f97db, baseColor: 0x050608, blurFactor: 0.6 };
    case "halo":
      return { backgroundColor: 0x050608, baseColor: 0xf1531e, amplitudeFactor: 1.4, size: 1.3, xOffset: 0.12 };
    case "dots":
      return { backgroundColor: 0x050608, color: 0xf1531e, color2: 0x2f97db, size: 3.4, spacing: 32 };
    case "cells":
      // dark, desaturated prism so it reads as a subtle texture either way
      return light
        ? { color1: 0xf7e0d6, color2: 0xdceaf5, size: 2.2, speed: 0.9 }
        : { color1: 0x241610, color2: 0x122733, size: 2.2, speed: 0.9 };
    case "clouds":
      return light
        ? { skyColor: 0xdcecfb, cloudColor: 0xf3f7fb, cloudShadowColor: 0xc3d3e2, sunColor: 0xe2481b, sunGlareColor: 0xe0900a, sunlightColor: 0xffb27a, speed: 0.7 }
        : { skyColor: 0x0b1220, cloudColor: 0x22303f, cloudShadowColor: 0x050608, sunColor: 0xf1531e, sunGlareColor: 0xf5a623, sunlightColor: 0xff9a4a, speed: 0.7 };
    case "clouds2":
      return light
        ? { backgroundColor: 0xffffff, skyColor: 0xdcecfb, cloudColor: 0xeff4f9, lightColor: 0xe2481b, speed: 0.7, texturePath: "/vanta-noise.png" }
        : { backgroundColor: 0x050608, skyColor: 0x0b1220, cloudColor: 0x243040, lightColor: 0xf1531e, speed: 0.7, texturePath: "/vanta-noise.png" };
    case "birds":
      return { backgroundColor: 0x050608, color1: 0xf1531e, color2: 0x2f97db, birdSize: 1.2, wingSpan: 24, speedLimit: 5, separation: 40, alignment: 40, cohesion: 40, quantity: 3 };
    case "topology":
      return { backgroundColor: 0x050608, color: 0xf1531e };
    case "trunk":
      return { backgroundColor: 0x050608, color: 0xf1531e, spacing: 4, chaos: 2 };
    default:
      return {};
  }
}
