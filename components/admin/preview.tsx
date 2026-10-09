"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Draft previews.
 *
 * An editor in /admin and the full-page preview are two browser tabs with no
 * shared state, and a draft should not have to be saved to be looked at. So the
 * editor mirrors its form to localStorage and the preview tab listens for it:
 * the page follows the typing, and nothing reaches the server or the site.
 *
 * Two things travel the other way. A picture is positioned by dragging it, and
 * the place to do that is on the page it will sit in, so the preview hands that
 * change back and the editor takes it into its form. And the preview can ask
 * for a save, so a draft that looks right can be published from where it is
 * being looked at. The editor still does the saving: it holds the entry, and
 * the preview holds only a copy of its form.
 */
export type Draft = Record<string, unknown>;

const key = (kind: string) => `ns-preview:${kind}`;
const dirtyKey = (kind: string) => `${key(kind)}:dirty`;

/**
 * Editor side: keep the preview tab in step with the form. `dirty` is whether
 * the form differs from what is saved, which the preview's Publish goes by.
 */
export function useDraftMirror(kind: string, form: Draft, enabled = true, dirty = true) {
  const raw = JSON.stringify(form);
  useEffect(() => {
    if (!enabled) return;
    try {
      localStorage.setItem(key(kind), raw);
      localStorage.setItem(dirtyKey(kind), dirty ? "1" : "0");
    } catch { /* private mode */ }
  }, [kind, raw, enabled, dirty]);
}

/** Preview side: whether the editor is holding anything that is not saved. */
function useDraftDirty(kind: string): boolean {
  const [dirty, setDirty] = useState(true);
  useEffect(() => {
    const read = () => {
      try { setDirty(localStorage.getItem(dirtyKey(kind)) !== "0"); } catch { setDirty(true); }
    };
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === dirtyKey(kind)) read(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [kind]);
  return dirty;
}

/** Preview side. `undefined` while reading, `null` when there is no draft. */
export function useDraft(kind: string): Draft | null | undefined {
  const [draft, setDraft] = useState<Draft | null | undefined>(undefined);
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(key(kind));
        setDraft(raw ? (JSON.parse(raw) as Draft) : null);
      } catch {
        setDraft(null);
      }
    };
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === key(kind)) read(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [kind]);
  return draft;
}

const patchKey = (kind: string) => `${key(kind)}:patch`;

/** Preview side: hand a change made on the page back to the editor. */
export function sendDraftPatch(kind: string, patch: Draft) {
  // Stamped, because storing the same value twice running raises no event.
  try { localStorage.setItem(patchKey(kind), JSON.stringify({ patch, at: Date.now() })); } catch { /* private mode */ }
}

/** Editor side: take in what the preview tab hands back. */
export function useDraftPatches(kind: string, apply: (patch: Draft) => void, enabled = true) {
  const latest = useRef(apply);
  useEffect(() => { latest.current = apply; });
  useEffect(() => {
    if (!enabled) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== patchKey(kind) || !e.newValue) return;
      try { latest.current((JSON.parse(e.newValue) as { patch: Draft }).patch); } catch { /* not ours */ }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [kind, enabled]);
}

const saveKey = (kind: string) => `${key(kind)}:save`;
const savedKey = (kind: string) => `${key(kind)}:saved`;

export type SaveResult = { ok: boolean; message: string; href?: string };
type SaveReply = { phase: "saving" } | ({ phase: "done" } & SaveResult);

/**
 * Editor side: save when the preview tab asks, and tell it how that went.
 *
 * The request carries the draft the preview is showing, and only the editor
 * holding that exact form answers. So what is published is what was looked at,
 * and a second editor tab with something else half-typed in it stays out of it.
 */
export function useSaveRequests(kind: string, form: Draft, save: () => Promise<SaveResult>, enabled = true) {
  const latest = useRef({ raw: "", save });
  useEffect(() => { latest.current = { raw: JSON.stringify(form), save }; });
  useEffect(() => {
    if (!enabled) return;
    const reply = (r: SaveReply) => {
      try { localStorage.setItem(savedKey(kind), JSON.stringify({ ...r, at: Date.now() })); } catch { /* private mode */ }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== saveKey(kind) || !e.newValue) return;
      try {
        if ((JSON.parse(e.newValue) as { draft: string }).draft !== latest.current.raw) return;
      } catch { return; }
      reply({ phase: "saving" });
      latest.current.save().then((r) => reply({ phase: "done", ...r }));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [kind, enabled]);
}

type RemoteSave = { phase: "idle" | "asking" | "saving" } | ({ phase: "done" } & SaveResult);

/** Preview side: ask the editor tab to save the draft on screen. */
export function useRemoteSave(kind: string) {
  const [state, setState] = useState<RemoteSave>({ phase: "idle" });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== savedKey(kind) || !e.newValue) return;
      try {
        const r = JSON.parse(e.newValue) as SaveReply;
        clearTimeout(timer.current);
        setState(r.phase === "saving" ? { phase: "saving" } : { phase: "done", ok: r.ok, message: r.message, href: r.href });
      } catch { /* not ours */ }
    };
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener("storage", onStorage); clearTimeout(timer.current); };
  }, [kind]);

  function save() {
    setState({ phase: "asking" });
    try {
      localStorage.setItem(saveKey(kind), JSON.stringify({ draft: localStorage.getItem(key(kind)) ?? "", at: Date.now() }));
    } catch { /* private mode */ }
    /* An editor holding this draft answers at once, before it starts saving.
       Silence means there is none: the tab was closed, or has moved on. */
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState({
      phase: "done", ok: false,
      message: "Could not reach the editor. Keep this post open in the admin tab, then try again.",
    }), 2500);
  }

  return { state, save };
}

/** The link an editor shows beside its save button. One named tab, reused. */
export function PreviewLink({ kind, className = "" }: { kind: string; className?: string }) {
  return (
    <a href={`/preview/${kind}`} target="ns-preview" className={`text-sm text-accent-deep hover:underline ${className}`}>
      Preview full page ↗
    </a>
  );
}

/* `live` is whether saving puts the entry on the site, or keeps it hidden. */
function PublishButton({ kind, live }: { kind: string; live: boolean }) {
  const { state, save } = useRemoteSave(kind);
  const dirty = useDraftDirty(kind);
  const working = state.phase === "asking" || state.phase === "saving";
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={save}
        disabled={working || !dirty}
        title={dirty ? undefined : "Nothing has changed"}
        className="bg-brand text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-brand-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand"
      >
        {working ? "Saving…" : live ? "Publish" : "Save"}
      </button>
      {state.phase === "done" && state.ok && (
        <p className="mt-2 text-sm text-ink/80">
          {live ? "Published. It is on the site now." : "Saved. It stays hidden until Published is ticked in the editor."}
          {state.href && (
            <a href={state.href} target="_blank" rel="noreferrer" className="ml-1 text-accent-deep hover:underline">View on site ↗</a>
          )}
        </p>
      )}
      {state.phase === "done" && !state.ok && <p className="mt-2 text-sm text-accent-deep">{state.message}</p>}
      {!dirty && state.phase !== "done" && <p className="mt-2 text-sm text-graphite">No changes to save.</p>}
    </div>
  );
}

export function DraftBadge({ problems = [], publish }: {
  problems?: string[];
  /** Set where the editor can save on the preview's request. */
  publish?: { kind: string; live: boolean };
}) {
  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm rounded-2xl border border-brand/50 bg-surface px-4 py-3 shadow-card">
      <p className="mono-label text-brand">Draft preview</p>
      <p className="mt-1 text-sm text-ink/80">Not published. This follows what you type in the editor.</p>
      {problems.map((p) => <p key={p} className="mt-1 text-sm text-accent-deep">{p}</p>)}
      {publish && <PublishButton kind={publish.kind} live={publish.live} />}
    </div>
  );
}

export function NoDraft({ where }: { where: string }) {
  return (
    <div className="relative z-10 mx-auto max-w-2xl px-5 pt-48 pb-32 text-center">
      <h1 className="display text-3xl text-ink">Nothing to preview yet</h1>
      <p className="mt-4 text-graphite">Open {where} in the admin and choose Preview full page.</p>
    </div>
  );
}
