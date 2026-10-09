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
  href = "/contact#form",
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  cta?: string;
  href?: string;
}) {
  /* The closing line takes the page's colour. Every one of these banners was
     an identical black heading over a blue label, on every page, which is what
     made them read as the same block repeated rather than as the close of the
     page they sit on. `--page-accent` is set by the industry, practice and
     vehicle pages; brand is the fallback where it is not. */
  const words = heading.trim().split(" ");
  const last = words.length > 1 ? words.pop()! : "";
  const lead = words.join(" ");
  const accent = "var(--page-accent, var(--color-brand))";

  return (
    <section className="relative z-10 bg-paper-tint/55 py-14 sm:py-18">
      <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
        <div className="group relative overflow-hidden rounded-[1.75rem] border border-line-blue/60 bg-surface px-7 py-12 sm:px-14 sm:py-16">
          {/* a hairline in the page's colour along the top edge */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${accent}, transparent 70%)` }} />
          <span aria-hidden className="anim-drift pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-[110px] opacity-[0.18]" style={{ background: accent }} />
          <span aria-hidden className="pointer-events-none absolute -left-28 -bottom-28 h-72 w-72 rounded-full bg-accent/10 blur-[120px]" />
          <div className="relative max-w-3xl">
            {eyebrow && (
              <div className="mb-4 flex items-center gap-3">
                <span aria-hidden className="prism-rule" style={{ background: accent }} />
                <p className="mono-label label-accent">{eyebrow}</p>
              </div>
            )}
            <h2 className="display text-3xl sm:text-5xl text-ink">
              {lead}{" "}
              <span className="italic" style={{ color: accent }}>{last}</span>
            </h2>
            {body && <p className="mt-5 max-w-xl text-graphite leading-relaxed">{body}</p>}
            <Link
              href={href}
              className="group mt-9 inline-flex items-center gap-3 btn-cta bg-brand text-white px-6 py-3.5 rounded-full font-medium hover:bg-brand-deep transition-colors"
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
