"use client";

import { useState } from "react";

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/**
 * An address field that takes any email, one or many.
 *
 * Type or paste, then Enter, comma, space or just click away: each address
 * becomes a chip. One that is not a valid address stays visible in red instead
 * of vanishing, so a typo is seen before the mail goes rather than after.
 */
export default function EmailChips({
  label,
  value,
  onChange,
  placeholder = "name@company.com",
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState("");

  function add(raw: string) {
    const parts = raw.split(/[,;\s]+/).map((p) => p.trim().toLowerCase()).filter(Boolean);
    if (parts.length) onChange([...new Set([...value, ...parts])]);
    setText("");
  }

  return (
    <div>
      <label className="mono-label text-graphite block mb-1.5">{label}</label>
      <div
        className="flex flex-wrap items-center gap-1.5 bg-surface border border-line rounded-xl px-3 py-2 focus-within:border-brand transition-colors cursor-text"
        onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement | null)?.focus()}
      >
        {value.map((email) => (
          <span
            key={email}
            className={`inline-flex items-center gap-1 rounded-full pl-3 pr-1.5 py-1 text-xs ${
              isEmail(email) ? "bg-paper-tint text-ink" : "bg-accent/15 text-accent-deep ring-1 ring-accent-deep/40"
            }`}
            title={isEmail(email) ? undefined : "This is not a valid email address"}
          >
            {email}
            <button
              type="button"
              aria-label={`Remove ${email}`}
              onClick={() => onChange(value.filter((v) => v !== email))}
              className="grid h-4 w-4 place-items-center rounded-full hover:bg-ink/10"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={text}
          onChange={(e) => {
            const v = e.target.value;
            /[,;\s]$/.test(v) ? add(v) : setText(v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Tab") {
              if (text.trim()) { e.preventDefault(); add(text); }
            } else if (e.key === "Backspace" && !text && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onPaste={(e) => { e.preventDefault(); add(text + e.clipboardData.getData("text")); }}
          onBlur={() => text.trim() && add(text)}
          placeholder={value.length ? "" : placeholder}
          className="min-w-[160px] flex-1 bg-transparent py-1 text-sm text-ink placeholder:text-graphite/50 focus:outline-none"
        />
      </div>
    </div>
  );
}
