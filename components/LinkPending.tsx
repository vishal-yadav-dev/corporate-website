"use client";

import { useLinkStatus } from "next/link";

/**
 * A spinner that appears inside a Link while its navigation is in flight.
 *
 * There is no route-level loading skeleton here on purpose: swapping the whole
 * page for placeholder blocks reads as something breaking rather than as a
 * navigation. Next keeps the current page on screen instead, which looks calm
 * but says nothing about the click — so the acknowledgement goes on the thing
 * that was actually clicked.
 *
 * `useLinkStatus` comes from `next/link` here, not `next/navigation`, and only
 * reports for the Link it is rendered inside.
 */
export default function LinkPending({ className = "" }: { className?: string }) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span
      aria-hidden
      className={`inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-[1.5px] border-current border-t-transparent ${className}`}
    />
  );
}
