import Reveal from "./Reveal";
import VantaBg from "./VantaBg";
import HeaderLogo from "./HeaderLogo";

type VantaEffect = "waves" | "rings" | "net" | "globe" | "fog" | "halo" | "dots" | "cells" | "birds" | "clouds" | "clouds2" | "topology" | "trunk";

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
  vanta,
  video,
  logo,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  vanta?: VantaEffect;
  /** basename in /public/videos, without extension — e.g. "plant" */
  video?: string;
  /** An awarding body's mark, turning in place of the generated background. */
  logo?: { src: string; alt: string };
}) {
  return (
    <section className="relative pt-[150px] sm:pt-[190px] pb-16 sm:pb-28 overflow-hidden">
      {/* A topic video takes precedence over the generated background. It is
          muted, looping and inert, so it never competes for attention or
          autoplay permission. */}
      {video && (
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
          >
            <source src={`/videos/${video}.mp4`} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper/85 via-paper/55 to-paper" />
        </>
      )}
      {!video && !logo && vanta && (
        <>
          <VantaBg effect={vanta} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper/80 via-paper/45 to-paper" />
        </>
      )}
      {logo && <HeaderLogo src={logo.src} />}
      {!vanta && !video && !logo && <div className="pointer-events-none absolute -top-20 right-0 h-[360px] w-[360px] rounded-full bg-brand/8 blur-[120px]" />}

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
