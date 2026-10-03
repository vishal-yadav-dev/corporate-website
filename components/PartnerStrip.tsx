import { getPartners } from "@/lib/site";

/**
 * Partner / client logos. Logos are colour SVGs — many have dark ink, so on the
 * dark theme every logo sits on a white tile to stay legible.
 */
export default async function PartnerStrip({
  heading = "Clients & Partners",
  title,
  variant = "marquee",
  className = "",
}: {
  heading?: string | null;
  title?: string;
  variant?: "marquee" | "compact";
  className?: string;
}) {
  const partners = await getPartners();

  const Tile = ({ name, logo, big = false }: { name: string; logo: string; big?: boolean }) => (
    <div
      className={`group/tile shrink-0 grid place-items-center rounded-2xl bg-white shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:ring-2 hover:ring-brand/35 hover:shadow-[0_26px_60px_-18px_rgba(0,0,0,0.65)] ${
        big ? "h-28 sm:h-32 px-8" : "h-20 px-6"
      }`}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={name}
          className={`w-auto object-contain opacity-85 transition-opacity duration-300 group-hover/tile:opacity-100 ${big ? "h-10 max-w-[200px]" : "h-7 max-w-[150px]"}`}
        />
      ) : (
        <span className="display text-lg text-[#17222E] text-center">{name}</span>
      )}
    </div>
  );

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        {partners.map((p) => <Tile key={p.name} name={p.name} logo={p.logo} />)}
      </div>
    );
  }

  return (
    <section className={`relative z-10 py-14 sm:py-18 overflow-hidden ${className}`}>
      {/* depth glow */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-72 bg-brand/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        {heading && <p className="mono-label text-accent-deep mb-3">{heading}</p>}
        {title && <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl mb-10">{title}</h2>}
      </div>

      <div className="marquee-rail relative py-6 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        {/* One row, duplicated once so the loop has somewhere to go. Two rows
            running against each other was tried and read as clutter. */}
        <div className="marquee-track flex items-center gap-5 w-max px-5" style={{ animationDuration: "40s" }}>
          {[...partners, ...partners].map((p, i) => (
            <Tile key={`${p.name}-${i}`} name={p.name} logo={p.logo} big />
          ))}
        </div>
      </div>
    </section>
  );
}
