import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import PartnerStrip from "@/components/PartnerStrip";
import { getOffices } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with Noblesoft Technologies. Offices in Texas, Monterrey, Visakhapatnam, and Noida.",
};

export default async function ContactPage() {
  const LOCATIONS = await getOffices();
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk." intro="Tell us what you're modernizing. We'll route you to the right practice lead — usually within one business day." vanta="clouds" art="points" />
      <section className="relative z-10 bg-surface pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20">
            <Reveal><ContactForm source="contact" /></Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-4">
                {LOCATIONS.map((loc) => (
                  <div key={loc.region} className="bg-paper border border-line rounded-2xl p-7">
                    <p className="mono-label text-accent-deep mb-2">{loc.role}</p>
                    <h3 className="display text-xl text-ink">{loc.region}</h3>
                    <p className="mt-2 text-sm text-graphite leading-relaxed">{loc.address}</p>
                    <a href={`tel:${loc.tel.replace(/[^+\d]/g, "")}`} className="mt-1 inline-block text-sm text-brand hover:underline">{loc.tel}</a>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Office locations on the map */}
      <section className="relative z-10 bg-paper-tint py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-12">
            <p className="mono-label text-accent-deep mb-3">Global locations</p>
            <h2 className="display text-4xl sm:text-6xl text-ink max-w-2xl">Find us on the ground.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6">
            {LOCATIONS.map((loc) => (
              <Reveal key={loc.region}>
                <div className="bg-surface border border-line rounded-2xl overflow-hidden">
                  <iframe
                    title={`Map — ${loc.region}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed`}
                    className="w-full h-64 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="p-6">
                    <p className="mono-label text-accent-deep mb-1">{loc.role}</p>
                    <h3 className="display text-xl text-ink">{loc.region}</h3>
                    <p className="mt-2 text-sm text-graphite leading-relaxed">{loc.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-brand hover:underline"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-surface">
        <PartnerStrip />
      </div>
    </>
  );
}
