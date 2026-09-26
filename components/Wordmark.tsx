/**
 * The Testsoft wordmark. "Test" carries the ink colour and "soft" the brand
 * orange, echoing the site's own signature of putting the closing word in
 * brand — and the monogram runs the prism spectrum described in globals.css
 * rather than a flat fill.
 */
export default function Wordmark({
  size = "md",
  mono = false,
}: {
  /** md — header and footer. lg — auth screens. */
  size?: "sm" | "md" | "lg";
  /** true keeps the monogram flat, for tight admin chrome. */
  mono?: boolean;
}) {
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-lg" : "text-xl";
  const badge = size === "lg" ? "h-9 w-9 text-lg" : "h-8 w-8 text-lg";

  return (
    <>
      <span
        className={`${badge} grid place-items-center text-white font-display font-bold rounded-[6px] shrink-0 ${
          mono ? "bg-brand" : "bg-[linear-gradient(135deg,var(--color-prism-red),var(--color-brand)_45%,var(--color-prism-violet))]"
        }`}
      >
        N
      </span>
      <span className={`display ${text} tracking-tight`}>
        <span className="text-ink">Test</span>
        <span className="text-brand">soft</span>
      </span>
    </>
  );
}
