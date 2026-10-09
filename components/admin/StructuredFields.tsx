"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Form controls for values the database keeps as JSON.
 *
 * A post's body is a list of sections and its summary a list of lines, stored
 * as JSON text so the article template controls the typography. Nobody writing
 * a post should have to type that by hand, so these controls take ordinary
 * typing and write the JSON themselves. The stored shape is unchanged.
 *
 * Each keeps its own copy of what is being typed. Rebuilding the boxes from the
 * JSON on every keystroke would eat a blank line the moment it was typed, since
 * an empty paragraph is not kept. The copy is refreshed only when the value
 * changes from outside: another entry opened, or the form cleared.
 */

const input =
  "w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";
const small = "text-xs text-graphite hover:text-ink disabled:opacity-30 disabled:hover:text-graphite";

function useDraft<T>(value: string, read: (value: string) => T, write: (draft: T) => string, onChange: (value: string) => void) {
  const [draft, setDraft] = useState<T>(() => read(value));
  const written = useRef(value);
  useEffect(() => {
    if (value === written.current) return;
    written.current = value;
    setDraft(read(value));
    // `read` is a module-level function at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const update = (next: T) => {
    setDraft(next);
    written.current = write(next);
    onChange(written.current);
  };
  return [draft, update] as const;
}

/* ---------- body: sections ---------- */

type Row = { heading: string; paras: string; list: string };

/** `null` when the stored text is not a list, so it is shown as it is instead of being lost. */
function readSections(value: string): Row[] | null {
  try {
    const v: unknown = JSON.parse(value || "[]");
    if (!Array.isArray(v)) return null;
    return v.map((s) => ({
      heading: String(s?.heading ?? ""),
      paras: Array.isArray(s?.paras) ? s.paras.join("\n\n") : "",
      list: Array.isArray(s?.list) ? s.list.join("\n") : "",
    }));
  } catch {
    return null;
  }
}

function writeSections(rows: Row[] | null): string {
  return JSON.stringify(
    (rows ?? [])
      .map((r) => {
        const heading = r.heading.trim();
        const paras = r.paras.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
        const list = r.list.split("\n").map((l) => l.trim()).filter(Boolean);
        return { ...(heading && { heading }), ...(paras.length && { paras }), ...(list.length && { list }) };
      })
      .filter((s) => Object.keys(s).length)
  );
}

export function SectionsField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [rows, setRows] = useDraft(value, readSections, writeSections, onChange);

  if (rows === null) {
    return (
      <div>
        <p className="text-sm text-accent-deep mb-2">The saved body is not in a form this editor can open, so it is shown as stored.</p>
        <textarea className={`${input} min-h-[140px] resize-y font-mono text-xs`} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  const set = (i: number, patch: Partial<Row>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const move = (i: number, by: number) => {
    const next = [...rows];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    setRows(next);
  };

  return (
    <div className="space-y-3">
      {rows.length === 0 && <p className="text-sm text-graphite">No sections yet. A post usually has three to five.</p>}
      {rows.map((r, i) => (
        <div key={i} className="rounded-xl border border-line bg-paper-tint/40 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <p className="mono-label text-graphite mr-auto">Section {i + 1}</p>
            <button type="button" className={small} disabled={i === 0} onClick={() => move(i, -1)}>Move up</button>
            <button type="button" className={small} disabled={i === rows.length - 1} onClick={() => move(i, 1)}>Move down</button>
            <button type="button" className="text-xs text-accent-deep hover:underline" onClick={() => setRows(rows.filter((_, j) => j !== i))}>Remove</button>
          </div>
          <input className={input} value={r.heading} onChange={(e) => set(i, { heading: e.target.value })} placeholder="Section heading (optional)" />
          <div>
            <textarea className={`${input} min-h-[130px] resize-y`} value={r.paras} onChange={(e) => set(i, { paras: e.target.value })} placeholder="Write the section here." />
            <p className="text-[11px] text-graphite/70 mt-1">Leave an empty line between paragraphs.</p>
          </div>
          <div>
            <textarea className={`${input} min-h-[70px] resize-y`} value={r.list} onChange={(e) => set(i, { list: e.target.value })} placeholder="Bullet points (optional)" />
            <p className="text-[11px] text-graphite/70 mt-1">One bullet per line. They appear under the text.</p>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows([...rows, { heading: "", paras: "", list: "" }])}
        className="border border-line text-ink px-4 py-2 rounded-full text-sm font-medium hover:border-ink transition-colors"
      >
        + Add section
      </button>
    </div>
  );
}

/* ---------- a list of lines ---------- */

function readLines(value: string): string | null {
  try {
    const v: unknown = JSON.parse(value || "[]");
    return Array.isArray(v) ? v.map(String).join("\n") : null;
  } catch {
    return null;
  }
}

const writeLines = (text: string | null) =>
  JSON.stringify((text ?? "").split("\n").map((l) => l.trim()).filter(Boolean));

export function LinesField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  const [text, setText] = useDraft(value, readLines, writeLines, onChange);

  if (text === null) {
    return <textarea className={`${input} min-h-[90px] resize-y font-mono text-xs`} value={value} onChange={(e) => onChange(e.target.value)} />;
  }
  return <textarea className={`${input} min-h-[110px] resize-y`} value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} />;
}

/* ---------- one of a few colours ---------- */

export type Swatch = { label: string; color: string };

/** Stores the index of the chosen colour, which is what the pages look up. */
export function SwatchField({ value, swatches, onChange }: { value: number; swatches: Swatch[]; onChange: (value: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {swatches.map((s, i) => {
        const chosen = i === value;
        return (
          <button
            key={s.label}
            type="button"
            role="radio"
            aria-checked={chosen}
            onClick={() => onChange(i)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              chosen ? "border-ink text-ink bg-surface" : "border-line text-graphite hover:border-graphite"
            }`}
          >
            <span aria-hidden className="h-4 w-4 rounded-full" style={{ background: s.color }} />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
