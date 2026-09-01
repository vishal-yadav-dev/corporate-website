import Link from "next/link";
import { getPartners, getOffices } from "@/lib/site";
import Newsletter from "./Newsletter";

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "SMS Policy", href: "/sms" },
  { label: "Cookies Policy", href: "/cookies" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Sitemap", href: "/sitemap" },
];
const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "YouTube", href: "https://www.youtube.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Facebook", href: "https://www.facebook.com" },
];

export default async function Footer() {
  const [partners, locations] = await Promise.all([getPartners(), getOffices()]);
  return (
    <footer className="relative z-10 bg-paper-deep text-ink overflow-hidden">
      <div className="pointer-events-none absolute -top-40 right-0 h-[420px] w-[420px] rounded-full bg-brand/12 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[360px] w-[360px] rounded-full bg-accent/10 blur-[130px]" />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
          <div>
            <p className="mono-label text-brand-bright mb-6">Let&apos;s build</p>
            <h2 className="display text-4xl sm:text-6xl max-w-xl text-ink">Ready to modernize your core systems?</h2>
            <Link href="/contact" className="group mt-8 inline-flex items-center gap-3 bg-brand text-white px-6 py-3.5 rounded-full font-medium hover:bg-brand-deep transition-colors">
              Start a conversation
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <div className="mt-10 max-w-md">
              <Newsletter />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {locations.map((loc) => (
              <div key={loc.region}>
                <p className="mono-label text-graphite mb-1">{loc.role}</p>
                <p className="font-medium text-ink">{loc.region}</p>
                <p className="text-sm text-graphite mt-1 leading-relaxed">{loc.address}</p>
                <p className="text-sm text-graphite mt-1">{loc.tel}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-line">
          <p className="mono-label text-graphite mb-5">Clients & Partners</p>
          <div className="flex flex-wrap items-center gap-2.5">
            {partners.map((p) =>
              p.logo ? (
                <div key={p.name} className="grid place-items-center bg-white rounded-lg h-11 px-4 ring-1 ring-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.logo} alt={p.name} className="h-5 w-auto max-w-[110px] object-contain" />
                </div>
              ) : (
                <span key={p.name} className="grid place-items-center bg-surface-2 rounded-lg h-11 px-4 text-xs text-graphite">
                  {p.name}
                </span>
              )
            )}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-line flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 grid place-items-center bg-brand text-white font-display font-bold rounded-[5px]">N</span>
            <span className="display text-lg text-ink">Testsoft</span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-graphite hover:text-brand transition-colors">{s.label}</a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-xs text-graphite">
          <p>© {new Date().getFullYear()} Testsoft Technologies Inc. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {LEGAL.map((l) => (<Link key={l.label} href={l.href} className="hover:text-brand transition-colors">{l.label}</Link>))}
          </div>
        </div>
      </div>
    </footer>
  );
}
