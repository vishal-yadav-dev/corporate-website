/**
 * The atmosphere behind a content section.
 *
 * Below the header the page was flat colour, so a section read as a slab
 * rather than as part of the same scene. This lays the same vocabulary the
 * pinned sections already use — a dot grid and slow prism drifts — under
 * ordinary content, at a strength that keeps text the brightest thing on the
 * page.
 *
 * It does not paint its own edge fades. The first version did, hardcoded to
 * `paper`, which is wrong the moment a section is `surface` or `paper-tint` —
 * every band ended up rimmed in a colour that did not match it. The section's
 * own background shows through instead, and the drifts are simply held away
 * from the edges by an inset so they fall off on their own.
 *
 * Pure CSS. The grid and the drifts already switch themselves off below 900px
 * and under prefers-reduced-motion, and the drift opacity rides `--wash-lg`,
 * which carries a higher value in light mode because a blurred colour at 16%
 * disappears on white.
 *
 * Drop it as the first child of a `relative` section and keep that section's
 * content above it with `relative z-10`.
 */
export default function SectionBackdrop({
  from = "bg-brand",
  to = "bg-prism-blue",
  /** "quiet" drops the colour and leaves only the grid */
  variant = "full",
}: {
  from?: string;
  to?: string;
  variant?: "full" | "quiet";
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bg-dotgrid anim-grid absolute inset-0 opacity-60" />
      {variant === "full" && (
        <>
          <div
            className={`anim-drift prism-wash-lg absolute -left-[8%] top-[6%] h-[46vh] w-[46vh] rounded-full ${from} blur-[150px]`}
          />
          <div
            className={`anim-drift prism-wash-lg absolute -right-[6%] bottom-[8%] h-[42vh] w-[42vh] rounded-full ${to} blur-[150px]`}
            style={{ animationDelay: "-7s" }}
          />
        </>
      )}
    </div>
  );
}
