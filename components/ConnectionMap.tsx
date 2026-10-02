"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/use-theme";

/**
 * A world map of the offices, with live links drawn between them.
 *
 * The coastlines are real. A 180x90 equirectangular grid was rasterised from
 * Natural Earth's 110m land polygons and packed one bit per cell, which is why
 * this is a 2.7KB string rather than a map image or a geo library — nothing is
 * fetched and nothing is parsed at runtime.
 *
 * Each link is a quadratic curve with a pulse running along it, offset in time
 * so the four never fire together.
 *
 * It answers the pointer: the whole map leans away from it, the nearest office
 * lights up and names itself, and the links touching that office brighten and
 * run faster. The canvas stays `pointer-events-none` and reads the pointer from
 * a window listener instead, so it never steals a hover or a click from the
 * headline sitting over it.
 *
 * Canvas 2D, and it stops when the header scrolls away or the reader asks for
 * reduced motion.
 */

/* 180x90 land mask, one bit per 2-degree cell, row-major from 90N/180W. */
const MASK =
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAfAP8DAAAAAAAAAAAAAAAAAAAAAADo//z//wcAAAAAAAACAAAAAAAAAAAAhvvw//8PAPABAAAAwAMAAAAAAAAAwADkw////wEABAAAAABgAAAAAAAAAADAUT8A/v8PAAAAAAwA/j8AuAEAAAAAcBHtDcD/fwAAAAAwAPz/fwMAABCAAQD5w/wD8P8FAAAMAIL7//9//xOAAP/ff0668QD/HwAA+A8At///////v3/w/////x8++B8AAOD/1//7////////jP////+/+AE/gAcAn9f//////////w/w/////wEs4AEAAHz+////////////gL////8HeAAcAADg5///////////9ADgAf7/f4AnAAAAAH78////////H0QAAAiA//8f8AcAAIBB4////////38ADwAQAOD//5//AQAAHAT/////////A3AAAAAA/v//+T8AAGDz//////////8DAQAAAMD/////AwAAsP//////////LwAAAAAA6P///2IAAAD+//////////8CAAAAAAD///8/CAAA4P//////////JwAAAAAA8P///wYAAAD+/un//////z8AAAAAAAD///8HAAAA/pgP/P//////MQAAAAAA8P//PwAAAMBD9v7//////wcBAAAAAAD///8AAAAAPkD7//////8hEAAAAAAA4P//DwAAAIDhAv//////f8YAAAAAAAD8//8AAAAA+AdE//////8jDwAAAAAAgP//AwAAAMD/APD/////PxgAAAAAAADw/x8AAAAA/n/v//////8HAAAAAAAAAPwDAgAAAOD////7////fwAAAAAAAACgHyAAAACA//9/f/7///8DAAAAAAAAAPQBAAAAAPj//+cv+P//PwAAAAAAAAAAHjAAAADA/////g/+//8EAAAAAAAAAOBhCAAAAP7//99/4D//AAAAAAAAAAAAPAMEAADA////+Qf84BcAAAAAAAAAAAA/AAAAAPz//58fgAf+QAAAAAAAAAAAAA8AAADg////ewA4gA8EAAAAAAAAAADAAAAAAPz//38BgAP4QQAAAAAAAAAAAAgPAADA////zwAwgAwQAAAAAAAAAAAA9Q8AAPj///8HAAVIAAAAAAAAAAAAAID/AQAA////fwBAAAAQAAAAAAAAAAAA+P8AAGDh//8DAAA0GAAAAAAAAAAAAID/HwAAAPj/HwAAgMIBAAAAAAAAAAAA/P8BAACA//8AAAAYXgAAAAAAAAAAAMD/fwAAAPz/BwAAAOOBAQAAAAAAAAAA/P8/AACA/z8AAABgbtQBAAAAAAAAAOD//w8AAPD/AwAAAAQIeAAAAAAAAAAA/P//AQAA/z8AAACAA4APAQAAAAAAAID//w8AAPD/AwAAAAARsEAAAAAAAAAA+P9/AAAA/j8AAAAAAAAAAAAAAAAAAAD//wcAAPD/QwAAAACAIwAAAAAAAAAA8P9/AAAA/z8EAAAAAD8GIAAAAAAAAAD8/wMAAPD/cQAAAAD4ZwAAAAAAAAAAgP8/AAAA/w8HAAAAgP8HAAAAAAAAAAD4/wMAAOD/MAAAAAD//wEBAAAAAAAAgP8PAAAA/g8DAAAA+P8fAAAAAAAAAAD4PwAAAOB/EAAAAID//wMAAAAAAAAAgP8DAAAA/AMAAAAA+P9/AAAAAAAAAAD8HwAAAMA/AAAAAID//wcAAAAAAAAAwP8BAAAA+AEAAAAA8P9/AAAAAAAAAAD8DwAAAIAPAAAAAAAP/gMAAAAAAAAAwB8AAAAAAAAAAAAAEIAfAAEAAAAAAAD+AwAAAAAAAAAAAAAA8AEgAAAAAAAA4AcAAAAAAAAAAAAAAAAAAAYAAAAAAABeAAAAAAAAAAAAAAAAwAAwAAAAAAAAwAMAAAAAAAAAAAAAAAAIgAEAAAAAAAAeAAAAAAAAAAAAAAAAAAAMAAAAAAAA4AEAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAABAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAB4AEDwn/8HAAAAAAAAAAAwAAAAAACA/P/h/////w8AAAAAAAAAwAcAAAD4////z///////PwAAAAAAHALwAACA//////////////8HAADw/y///wMAAP7/////////////HwAA+P///38AAID///////////////8AAPL/////BwAO////////////////DwAA8P////8HEPD//////////////z8AAOD/////////////////////////H/AfwP//////////////////////////////////////////////////////////////////////////////////////AA==";
const GW = 180;
const GH = 90;

export type Place = { label: string; country: string; lat: number; lon: number; color: string };

/* One prism colour each, so the four read apart at a glance rather than as
   four identical orange pins. */
const OFFICES: Place[] = [
  { label: "Texas", country: "USA", lat: 32.78, lon: -96.8, color: "#F1531E" },
  { label: "North York", country: "Canada", lat: 43.77, lon: -79.41, color: "#7E5BE6" },
  { label: "Monterrey", country: "Mexico", lat: 25.69, lon: -100.32, color: "#F5A623" },
  { label: "Noida", country: "India", lat: 28.54, lon: 77.39, color: "#27B36B" },
  { label: "Visakhapatnam", country: "India", lat: 17.69, lon: 83.22, color: "#2F97DB" },
];

/* Every office joined to every other, not a star out of one. Ten links across
   five offices, each carrying its own pulse on its own phase, so there is
   always traffic somewhere on the map and no two runs start together. */
const LINKS: [number, number][] = OFFICES.flatMap((_, i) =>
  OFFICES.slice(i + 1).map((_, j): [number, number] => [i, i + 1 + j])
);

function decode(b64: string) {
  const bin = atob(b64);
  const bits = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bits[i] = bin.charCodeAt(i);
  return bits;
}

export default function ConnectionMap() {
  const ref = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const bits = decode(MASK);
    const light = theme === "light";
    /* On white the land needs more ink to register at all, and the label plate
       has to flip or it reads as a hole in the page. */
    const LAND = light ? "#1E88C7" : "#2F97DB";
    const LAND_A = light ? 0.30 : 0.20;
    const PLATE = light ? "#FFFFFF" : "#050608";
    const PLATE_TEXT = light ? "#BF3A12" : "#FF7A45";
    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;

    /* The map is laid out on its own 2:1 box, centred and scaled to cover the
       header, so the projection stays correct whatever the header's shape. */
    let mx = 0;
    let my = 0;
    let mw = 0;
    let mh = 0;

    /* pointer in canvas space, plus the eased value the map actually follows */
    const ptr = { x: -9999, y: -9999, lx: 0, ly: 0, elx: 0, ely: 0 };
    /* which office is nearest the pointer, and how lit each one currently is */
    let near = -1;
    const lit = OFFICES.map(() => 0);

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      mw = Math.max(w, h * 2);
      mh = mw / 2;
      mx = (w - mw) / 2;
      /* pushed down a little: the top of the header belongs to the headline */
      my = (h - mh) / 2 + h * 0.12;
    };
    resize();

    const at = (lat: number, lon: number) => ({
      x: mx + ((lon + 180) / 360) * mw,
      y: my + ((90 - lat) / 180) * mh,
    });


    const draw = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const time = t * 0.001;

      /* the map leans away from the pointer — a shift, not a chase */
      ptr.elx += (ptr.lx - ptr.elx) * 0.06;
      ptr.ely += (ptr.ly - ptr.ely) * 0.06;
      const ox = -ptr.elx * 26;
      const oy = -ptr.ely * 16;

      const pts = OFFICES.map((o) => {
        const q = at(o.lat, o.lon);
        return { x: q.x + ox, y: q.y + oy };
      });

      /* nearest office within reach of the pointer */
      near = -1;
      let best = 70;
      pts.forEach((q, i) => {
        const d = Math.hypot(q.x - ptr.x, q.y - ptr.y);
        if (d < best) { best = d; near = i; }
      });
      pts.forEach((_, i) => {
        const target = i === near ? 1 : 0;
        lit[i] += (target - lit[i]) * 0.12;
      });

      /* land */
      const cell = mw / GW;
      const dot = Math.max(0.7, cell * 0.30);
      ctx.fillStyle = LAND;
      for (let row = 0; row < GH; row++) {
        const y = my + ((row + 0.5) / GH) * mh + oy;
        if (y < -10 || y > h + 10) continue;
        for (let col = 0; col < GW; col++) {
          const i = row * GW + col;
          if (!(bits[i >> 3] & (1 << (i & 7)))) continue;
          const x = mx + ((col + 0.5) / GW) * mw + ox;
          if (x < -10 || x > w + 10) continue;
          ctx.globalAlpha = LAND_A;
          ctx.beginPath();
          ctx.arc(x, y, dot, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* links, each with its own pulse running along it */
      LINKS.forEach(([a, b], i) => {
        const p0 = pts[a];
        const p1 = pts[b];
        /* lift the control point perpendicular to the chord, so the curve
           arcs the way a route on a globe would */
        const cxm = (p0.x + p1.x) / 2;
        const cym = (p0.y + p1.y) / 2;
        const d = Math.hypot(p1.x - p0.x, p1.y - p0.y);
        const cpx = cxm;
        const cpy = cym - d * 0.28;

        /* a link touching the lit office brightens with it */
        const hot = Math.max(lit[a], lit[b]);
        const hue = OFFICES[b].color;
        ctx.globalAlpha = (light ? 0.26 : 0.20) + hot * 0.55;
        ctx.strokeStyle = hue;
        ctx.lineWidth = 1 + hot * 1.2;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.quadraticCurveTo(cpx, cpy, p1.x, p1.y);
        ctx.stroke();

        /* the pulse: offset per link so they never travel together */
        const k = (time * (0.3 + hot * 0.5) + i / LINKS.length) % 1;
        for (let s = 0; s < 7; s++) {
          const u = k - s * 0.018;
          if (u < 0 || u > 1) continue;
          const iv = 1 - u;
          const x = iv * iv * p0.x + 2 * iv * u * cpx + u * u * p1.x;
          const y = iv * iv * p0.y + 2 * iv * u * cpy + u * u * p1.y;
          ctx.globalAlpha = (1 - s / 7) * 0.9;
          ctx.fillStyle = hue;
          ctx.beginPath();
          ctx.arc(x, y, (3.1 + hot * 1.6) - s * 0.32, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      /* the offices themselves, each breathing on its own phase */
      pts.forEach((q, i) => {
        const g = lit[i];
        const hue = OFFICES[i].color;
        const phase = (time * (0.7 + g * 0.6) + i * 0.5) % 1;
        ctx.globalAlpha = (1 - phase) * ((light ? 0.7 : 0.55) + g * 0.35);
        ctx.strokeStyle = hue;
        ctx.lineWidth = 1.7 + g * 1.4;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 6 + phase * (22 + g * 16), 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 0.95;
        ctx.fillStyle = hue;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 5.4 + g * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = light ? "#FFFFFF" : "#FFFFFF";
        ctx.beginPath();
        ctx.arc(q.x, q.y, 2.1 + g * 1.1, 0, Math.PI * 2);
        ctx.fill();

        /* the name, once the office is lit enough to be worth reading */
        if (g > 0.05) {
          const label = `${OFFICES[i].label} · ${OFFICES[i].country}`.toUpperCase();
          ctx.font = "600 11px ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.textBaseline = "middle";
          const tw = ctx.measureText(label).width;
          const lx = q.x + 18;
          const ly = q.y - 18;
          ctx.globalAlpha = g * 0.85;
          ctx.fillStyle = PLATE;
          ctx.beginPath();
          /* roundRect is recent; a throw here would happen inside the frame
             loop and take the whole animation down with it. */
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(lx - 7, ly - 10, tw + 14, 20, 10);
          } else {
            ctx.rect(lx - 7, ly - 10, tw + 14, 20);
          }
          ctx.fill();
          ctx.globalAlpha = g * 0.35;
          ctx.strokeStyle = hue;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = g;
          ctx.fillStyle = PLATE_TEXT;
          ctx.fillText(label, lx, ly + 1);
        }
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !raf) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!e.isIntersecting && raf) {
          running = false;
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(cv);

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.lx = (ptr.x - w / 2) / w;
      ptr.ly = (ptr.y - h / 2) / h;
    };
    const onLeave = () => {
      ptr.x = -9999;
      ptr.y = -9999;
      ptr.lx = 0;
      ptr.ly = 0;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [theme]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
