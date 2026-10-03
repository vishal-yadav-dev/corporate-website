/**
 * An awarding body's logo turning slowly in a page header, in place of the
 * generated background.
 *
 * Three nested layers, each owning one transform so they compose rather than
 * overwrite each other: perspective, a vertical float, and a yaw. All of it is
 * CSS keyframes the compositor runs on its own — no JavaScript, no scroll
 * listener, and both animations are already in the two prefers-reduced-motion
 * blocks that switch the rest of the site's motion off.
 *
 * Decorative here: the same logo appears further down the page with a real
 * alt, so this copy is hidden from assistive technology rather than announced
 * twice. It is also desktop-only, since at phone width there is no room beside
 * the headline.
 */
export default function HeaderLogo({ src }: { src: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-[3%] xl:right-[6%] top-1/2 -translate-y-1/2 z-0 hidden lg:block scene"
    >
      <div className="preserve-3d anim-float">
        <div className="preserve-3d anim-sway">
          <div className="relative">
            <span className="anim-pulse-glow absolute -inset-16 rounded-full bg-brand/30 blur-[110px]" />
            {/* The official mark is a wide banner, so the plate follows its
                shape rather than boxing it into a square. */}
            <div
              className="relative overflow-hidden grid place-items-center rounded-2xl bg-white px-9 py-7 xl:px-12 xl:py-9 ring-1 ring-black/5 w-[420px] xl:w-[520px]"
              style={{ boxShadow: "0 55px 120px -45px rgba(0,0,0,0.9)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="relative block w-full h-auto" />
              {/* light crossing the plate, clipped to its shape */}
              <span
                aria-hidden
                className="plate-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
                style={{ background: "linear-gradient(100deg, transparent, rgba(255,255,255,.85), transparent)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
