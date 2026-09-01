"use client";

/**
 * Animated decorative visual for page headers — CSS/SVG 3D only, no WebGL.
 * A range of forms so no two pages feel the same.
 */
export default function HeaderArt({
  variant = "points",
}: {
  variant?: "points" | "helix" | "cubes" | "shards" | "orbit";
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-[-2%] top-1/2 -translate-y-1/2 z-0 hidden lg:block scene opacity-80 anim-travel"
      style={{ width: "min(34vw, 430px)", height: "min(34vw, 430px)" }}
    >
      {variant === "points" && <Points />}
      {variant === "helix" && <Helix />}
      {variant === "cubes" && <Cubes />}
      {variant === "shards" && <Shards />}
      {variant === "orbit" && <Orbit />}
    </div>
  );
}

const PRISM = ["#E5352F", "#F1531E", "#F5A623", "#27B36B", "#2F97DB", "#7E5BE6"];
/* Deterministic pseudo-random. Note: "deterministic" is not enough on its own —
   Math.sin is not required to be correctly rounded, so Node and Safari can
   differ in the last digit. Every value that reaches the markup is rounded
   (see `fx`) or React discards the server HTML and re-renders on hydration. */
const rng = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
/** Round to a precision both engines agree on. */
const fx = (n: number) => +n.toFixed(3);

/* ---- Points: a dense, tightly-packed rotating 3D particle cloud ---- */
function Points() {
  // pack particles inside a sphere for an even, dense look
  const dots = Array.from({ length: 220 }, (_, i) => {
    const u = rng(i + 1);
    const v = rng(i + 91);
    const r = 220 * Math.cbrt(rng(i + 181)); // uniform within sphere
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    return {
      x: fx(r * Math.sin(phi) * Math.cos(theta)),
      y: fx(r * Math.sin(phi) * Math.sin(theta)),
      z: fx(r * Math.cos(phi)),
      s: fx(1.6 + rng(i + 271) * 2.6),
      c: PRISM[i % PRISM.length],
    };
  });
  return (
    <div className="w-full h-full grid place-items-center">
      <div className="preserve-3d anim-spin-3d relative" style={{ width: 1, height: 1 }}>
        <div className="preserve-3d anim-float" style={{ position: "absolute", inset: 0 }}>
          {dots.map((d, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: d.s,
                height: d.s,
                marginLeft: -d.s / 2,
                marginTop: -d.s / 2,
                background: d.c,
                boxShadow: `0 0 ${d.s * 2.4}px ${d.c}`,
                transform: `translate3d(${d.x.toFixed(1)}px, ${d.y.toFixed(1)}px, ${d.z.toFixed(1)}px)`,
                opacity: 0.9,
              }}
            />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-brand/8 blur-[140px]" />
    </div>
  );
}

/* ---- Helix: two strands of points spiralling ---- */
function Helix() {
  const N = 26;
  const items = Array.from({ length: N }, (_, i) => {
    const t = (i / N) * Math.PI * 4;
    const y = (i / N - 0.5) * 380;
    return [
      { x: fx(Math.cos(t) * 90), z: fx(Math.sin(t) * 90), y: fx(y), c: PRISM[i % 6] },
      { x: fx(Math.cos(t + Math.PI) * 90), z: fx(Math.sin(t + Math.PI) * 90), y: fx(y), c: PRISM[(i + 3) % 6] },
    ];
  }).flat();
  return (
    <div className="preserve-3d anim-spin-3d w-full h-full grid place-items-center">
      <div className="preserve-3d relative">
        {items.map((p, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full"
            style={{
              background: p.c,
              boxShadow: `0 0 10px ${p.c}`,
              transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px)`,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-accent/8 blur-[130px]" />
    </div>
  );
}

/* ---- Cubes: an isometric lattice with a rolling wave ---- */
function Cubes() {
  const grid = 4;
  const cells = Array.from({ length: grid * grid }, (_, i) => ({
    gx: i % grid,
    gy: Math.floor(i / grid),
  }));
  return (
    <div className="w-full h-full grid place-items-center scene">
      {/* tilt wrapper — no animation class so the transform sticks */}
      <div className="preserve-3d" style={{ transform: "rotateX(60deg) rotateZ(45deg)" }}>
        <div className="preserve-3d relative anim-spin-3d" style={{ animationDuration: "34s", width: 1, height: 1 }}>
          {cells.map((c, i) => {
            const size = 44;
            const gap = 14;
            const off = ((grid - 1) * (size + gap)) / 2;
            const lift = 10 + rng(i + 3) * 46;
            return (
              <div
                key={i}
                className="absolute rounded-[6px] border"
                style={{
                  width: size,
                  height: size,
                  marginLeft: -size / 2,
                  marginTop: -size / 2,
                  transform: `translate3d(${c.gx * (size + gap) - off}px, ${c.gy * (size + gap) - off}px, ${lift}px)`,
                  borderColor: PRISM[i % 6] + "77",
                  background: PRISM[i % 6] + "1f",
                  boxShadow: `0 0 24px ${PRISM[i % 6]}33`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---- Shards: translucent glass planes floating at depth ---- */
function Shards() {
  const planes = [
    { rz: -18, ry: 24, z: -80, c: PRISM[4] },
    { rz: 8, ry: -14, z: 10, c: PRISM[1] },
    { rz: -6, ry: 30, z: 90, c: PRISM[5] },
  ];
  return (
    <div className="scene w-full h-full grid place-items-center">
      <div className="preserve-3d relative anim-float" style={{ width: 260, height: 320 }}>
        {planes.map((p, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-2xl border backdrop-blur-sm anim-drift"
            style={{
              transform: `translateZ(${p.z}px) rotateY(${p.ry}deg) rotateZ(${p.rz}deg)`,
              borderColor: p.c + "55",
              background: `linear-gradient(140deg, ${p.c}1f, transparent 70%)`,
              animationDelay: `${i * -4}s`,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-brand/10 blur-[130px]" />
    </div>
  );
}

/* ---- Orbit: planets on angled rings (kept for variety, used sparingly) ---- */
function Orbit() {
  const rings = [
    { rx: 74, ry: 0, r: 150, c: PRISM[1], d: 0 },
    { rx: 68, ry: 55, r: 120, c: PRISM[4], d: -3 },
    { rx: 80, ry: -35, r: 95, c: PRISM[3], d: -6 },
  ];
  return (
    <div className="w-full h-full grid place-items-center scene anim-float">
      <div className="preserve-3d relative" style={{ width: 1, height: 1 }}>
        {rings.map((ring, i) => (
          <div
            key={i}
            className="preserve-3d absolute left-0 top-0"
            style={{ transform: `rotateX(${ring.rx}deg) rotateY(${ring.ry}deg)` }}
          >
            <div
              className="preserve-3d anim-orbit"
              style={{ animationDuration: `${16 + i * 6}s`, animationDelay: `${ring.d}s` }}
            >
              <div
                className="absolute rounded-full border"
                style={{
                  width: ring.r * 2,
                  height: ring.r * 2,
                  marginLeft: -ring.r,
                  marginTop: -ring.r,
                  borderColor: ring.c + "44",
                }}
              />
              <span
                className="absolute rounded-full"
                style={{
                  width: 12, height: 12, marginLeft: -6, marginTop: -6 - ring.r,
                  background: ring.c, boxShadow: `0 0 16px ${ring.c}`,
                }}
              />
            </div>
          </div>
        ))}
        <span
          className="absolute rounded-full"
          style={{
            width: 56, height: 56, marginLeft: -28, marginTop: -28,
            background: "radial-gradient(circle at 40% 35%, #FF7A45, #CE3F12 65%, transparent 78%)",
            boxShadow: "0 0 60px 8px rgba(241,83,30,0.45)",
          }}
        />
      </div>
    </div>
  );
}
