import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import PartnerStrip from "@/components/PartnerStrip";
import SectionBackdrop from "@/components/SectionBackdrop";
import FlowField from "@/components/FlowField";
import FormFocus from "@/components/FormFocus";
import { getOffices } from "@/lib/site";

/* ISR: rendered once and reused for a minute, so a click is not waiting
   on a database round trip. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with Testsoft Technologies. Offices in Texas, Monterrey, Visakhapatnam, and Noida.",
};

export default async function ContactPage() {
  const LOCATIONS = await getOffices();
  return (
    <>
      <FormFocus />
      <PageHeader eyebrow="Contact" title="Let’s talk." intro="Whether you’re modernizing an enterprise platform, building a digital solution, integrating systems, or scaling your technology team, we’re ready to help." dome />
      <section className="relative z-10 overflow-hidden bg-surface pt-12 sm:pt-16 pb-16 sm:pb-20">
        {/* The header already carries the office map, so the field runs behind
            the content instead of competing with it up there. */}
        <FlowField seed={1} />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-surface/70" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20">
            <Reveal>
              {/* The target every "Talk to an Expert" points at. scroll-mt
                  clears the fixed 72px header so the form is not left under
                  it. */}
              <div id="form" className="scroll-mt-16">
                <ContactForm source="contact" />
              </div>
            </Reveal>
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
      <section className="relative z-10 bg-paper-tint py-14 sm:py-18">
        <SectionBackdrop from="bg-prism-violet" to="bg-prism-blue" />
        {/* positioned, so it paints over the absolutely-placed backdrop */}
        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="mb-9">
            <p className="mono-label text-accent-deep mb-3">Global locations</p>
            <h2 className="display text-4xl sm:text-6xl text-ink max-w-2xl">Find us on the ground.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6">
            {LOCATIONS.map((loc) => (
              <Reveal key={loc.region}>
                <div className="bg-surface border border-line rounded-2xl overflow-hidden">
                  <iframe
                    title={`Map of ${loc.region}`}
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
