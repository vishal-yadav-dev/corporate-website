import Reveal from "./Reveal";
import HeaderArt from "./HeaderArt";
import VantaBg from "./VantaBg";

type VantaEffect = "waves" | "rings" | "net" | "globe" | "fog" | "halo" | "dots" | "cells" | "birds" | "clouds" | "clouds2" | "topology" | "trunk";
type ArtVariant = "points" | "helix" | "cubes" | "shards" | "orbit";

/** Last word in brand italic — the same signature the homepage hero uses. */
function renderTitle(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return title;
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <span className="text-brand italic">{last}</span>
    </>
  );
}

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
          {/* Same treatment as the homepage carousel: the last word carries the
              brand colour in italic, at the hero's viewport-relative scale. */}
          <h1 className="display text-ink text-[11vw] sm:text-[8vw] lg:text-[6.5vw] leading-[0.95] max-w-5xl">
            {renderTitle(title)}
          </h1>
          {intro && <p className="mt-8 max-w-2xl text-lg sm:text-xl text-graphite leading-relaxed">{intro}</p>}
        </Reveal>
      </div>
    </section>
  );
}
