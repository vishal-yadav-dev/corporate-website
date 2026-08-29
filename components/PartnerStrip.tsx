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
  variant?: "marquee" | "grid" | "compact";
  className?: string;
}) {
  const partners = await getPartners();

  const Tile = ({ name, logo, big = false }: { name: string; logo: string; big?: boolean }) => (
    <div
      className={`shrink-0 grid place-items-center rounded-2xl bg-white shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-black/5 ${
        big ? "h-28 sm:h-32 px-8" : "h-20 px-6"
      }`}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={name} className={`w-auto object-contain ${big ? "h-10 max-w-[200px]" : "h-7 max-w-[150px]"}`} />
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
    <section className={`relative z-10 py-20 sm:py-28 overflow-hidden ${className}`}>
      {/* depth glow */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-72 bg-brand/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        {heading && <p className="mono-label text-accent-deep mb-3">{heading}</p>}
        {title && <h2 className="display text-4xl sm:text-6xl text-ink max-w-3xl mb-14">{title}</h2>}
      </div>

      {variant === "grid" ? (
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 scene" style={{ perspective: 1200 }}>
            {partners.map((p) => (
              <div key={p.name} className="card-3d rounded-2xl">
                <Tile name={p.name} logo={p.logo} big />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative py-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="marquee-track flex items-center gap-6 w-max px-6">
            {[...partners, ...partners].map((p, i) => (
              <Tile key={i} name={p.name} logo={p.logo} big />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
