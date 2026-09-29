import Link from "next/link";

/**
 * Contextual end-of-page CTA. The blueprint asks every practice, solution and
 * industry page to close with one — distinct from the global footer CTA, and
 * worded for the page it sits on.
 */
export default function CtaBanner({
  eyebrow,
  heading,
  body,
  cta = "Talk to an Expert",
  href = "/contact",
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  cta?: string;
  href?: string;
}) {
  return (
    <section className="relative z-10 bg-paper-tint/55 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[28px] border border-line-blue/60 bg-surface px-7 py-12 sm:px-14 sm:py-16">
          <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-[110px]" />
          <span aria-hidden className="pointer-events-none absolute -left-28 -bottom-28 h-72 w-72 rounded-full bg-accent/10 blur-[120px]" />
          <div className="relative max-w-3xl">
            {eyebrow && <p className="mono-label text-accent-deep mb-4">{eyebrow}</p>}
            <h2 className="display text-3xl sm:text-5xl text-ink">{heading}</h2>
            {body && <p className="mt-5 max-w-xl text-graphite leading-relaxed">{body}</p>}
            <Link
              href={href}
              className="group mt-9 inline-flex items-center gap-3 bg-brand text-white px-6 py-3.5 rounded-full font-medium hover:bg-brand-deep transition-colors"
            >
              {cta}
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
