"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ApplyForm from "@/components/ApplyForm";

/**
 * An open application, for readers who did not find a role that fits.
 *
 * The form is the same one the job pages use, with no job behind it — job_id is
 * nullable and the route already skips the title lookup when it is missing, so
 * this is the existing path with one field left empty rather than a second
 * intake to keep working.
 *
 * The card turns over to reveal it. Two things make that work rather than just
 * look like it:
 *
 *   - the front face stays in normal flow, so closed the card is simply as tall
 *     as its own content — no script, nothing to measure, and it is right in
 *     the server HTML. Only the back is taken out of flow, and only while it is
 *     open is a measured height applied, so the two faces can differ in height
 *     without the card ever collapsing or leaving a gap under itself.
 *   - the face turned away is marked `inert`, so its inputs cannot be reached
 *     by Tab. `backface-visibility` only hides pixels; it does nothing about
 *     focus order, and a form you cannot see but can still type into is worse
 *     than no animation at all.
 *
 * Under prefers-reduced-motion the card swaps faces instead of turning.
 */
export default function ResumeDrop() {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [reduced, setReduced] = useState(false);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  /* Only the open state needs a number; closed, the front face sizes the card. */
  const measure = useCallback(() => {
    if (!open) {
      setHeight(undefined);
      return;
    }
    const el = backRef.current;
    if (el) setHeight(el.offsetHeight);
  }, [open]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    measure();
    if (typeof ResizeObserver === "undefined") return;
    /* the form grows as validation messages appear and as the file name lands */
    const ro = new ResizeObserver(measure);
    if (frontRef.current) ro.observe(frontRef.current);
    if (backRef.current) ro.observe(backRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const EASE = "cubic-bezier(.22,1,.36,1)";
  const hideBack = "[backface-visibility:hidden] [-webkit-backface-visibility:hidden]";

  return (
    <div className="scene" style={{ perspective: 1600 }}>
      <div
        className="preserve-3d relative"
        style={{
          height,
          transform: open && !reduced ? "rotateY(180deg)" : "none",
          transition: reduced ? "none" : `transform .8s ${EASE}, height .55s ${EASE}`,
        }}
      >
        {/* ---- front: the pitch ---- */}
        <div ref={frontRef} className={hideBack} inert={open || undefined} aria-hidden={open}>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-line-blue/60 bg-surface px-7 py-11 sm:px-14 sm:py-14">
            <span aria-hidden className="prism-wash-lg pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-prism-blue blur-[120px]" />
            <span aria-hidden className="prism-wash-lg pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-prism-violet blur-[120px]" />
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="mono-label text-accent-deep mb-4">Open application</p>
                <h2 className="display text-3xl sm:text-5xl text-ink">
                  Want to get hired? Drop us your <span className="text-brand italic">resume.</span>
                </h2>
                <p className="mt-5 text-graphite leading-relaxed">
                  Nothing open that fits right now? Send it anyway. We staff roles across engineering,
                  delivery and recruiting all year, and the first place we look is the CVs we already have.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group btn-cta inline-flex shrink-0 items-center gap-3 rounded-full bg-brand px-7 py-3.5 font-medium text-white transition-colors hover:bg-brand-deep"
              >
                Drop your resume
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* ---- back: the form, pre-turned so it lands face up ---- */}
        <div
          ref={backRef}
          className={`absolute inset-x-0 top-0 ${hideBack}`}
          style={{ transform: "rotateY(180deg)" }}
          inert={!open || undefined}
          aria-hidden={!open}
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-line-blue/60 bg-surface px-7 py-9 sm:px-14 sm:py-12">
            <span aria-hidden className="prism-wash-lg pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-prism-blue blur-[120px]" />
            <div className="relative mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mono-label text-accent-deep mb-3">Open application</p>
                <h2 className="display text-2xl sm:text-4xl text-ink">Tell us about yourself.</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mono-label text-accent-deep hover:text-brand transition-colors"
              >
                ← Back
              </button>
            </div>
            <div className="relative">
              <ApplyForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
