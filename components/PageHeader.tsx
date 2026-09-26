import Reveal from "./Reveal";
import HeaderArt from "./HeaderArt";
import VantaBg from "./VantaBg";

type VantaEffect = "waves" | "rings" | "net" | "globe" | "fog" | "halo" | "dots" | "cells" | "birds" | "clouds" | "clouds2" | "topology" | "trunk";
type ArtVariant = "points" | "helix" | "cubes" | "shards" | "orbit";

export default function PageHeader({
  eyebrow,
  title,
  intro,
  art,
  vanta,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  art?: ArtVariant;
  vanta?: VantaEffect;
}) {
  return (
    <section className="relative pt-[150px] sm:pt-[190px] pb-16 sm:pb-28 overflow-hidden">
      {vanta && (
        <>
          <VantaBg effect={vanta} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper/80 via-paper/45 to-paper" />
        </>
      )}
      {!vanta && <div className="pointer-events-none absolute -top-20 right-0 h-[360px] w-[360px] rounded-full bg-brand/8 blur-[120px]" />}
      {art && <HeaderArt variant={art} />}

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 relative z-10">
        <Reveal>
          <p className="mono-label text-accent-deep mb-6">{eyebrow}</p>
          {/* Headlines carry their presence from scale, so the size is set by the
              longest LINE, not the whole string. Sentences are broken onto their
              own lines — three short stacked lines read as deliberate, where the
              same words ragging across five lines read as an accident. */}
          {(() => {
            const lines = title
              .split(/(?<=\.)\s+/)
              .map((l) => l.trim())
              .filter(Boolean);
            const longest = Math.max(...lines.map((l) => l.length));
            const size =
              longest <= 26
                ? "text-6xl sm:text-8xl lg:text-[8rem]"
                : longest <= 40
                  ? "text-5xl sm:text-7xl lg:text-8xl"
                  : "text-[2.75rem] sm:text-6xl lg:text-7xl";
            return (
              <h1 className={`display text-ink ${size} max-w-5xl text-balance`}>
                {lines.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            );
          })()}
          {intro && <p className="mt-8 max-w-2xl text-lg sm:text-xl text-graphite leading-relaxed">{intro}</p>}
        </Reveal>
      </div>
    </section>
  );
}
