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
          <h1 className="display text-ink text-6xl sm:text-8xl lg:text-[8rem] max-w-4xl">{title}</h1>
          {intro && <p className="mt-8 max-w-2xl text-lg sm:text-xl text-graphite leading-relaxed">{intro}</p>}
        </Reveal>
      </div>
    </section>
  );
}
