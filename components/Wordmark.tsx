/**
 * The Testsoft wordmark: a single ink colour. A two-tone split was tried and
 * read as cheap at this size. The monogram carries the colour instead, running
 * the prism spectrum described in globals.css.
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
        className={`${badge} grid place-items-center text-white font-display font-bold rounded-[0.375rem] shrink-0 ${
          mono ? "bg-brand" : "bg-[linear-gradient(135deg,var(--color-prism-red),var(--color-brand)_45%,var(--color-prism-violet))]"
        }`}
      >
        N
      </span>
      <span className={`display ${text} tracking-tight text-ink`}>Testsoft</span>
    </>
  );
}
