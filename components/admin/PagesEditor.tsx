"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CopyField } from "@/lib/copy";

/** Which site URL a page's preview should load. */
const PAGE_URL: Record<string, string> = {
  Home: "/",
  Practices: "/practices",
  Solutions: "/solutions",
  Industries: "/industries",
  Company: "/company",
  Careers: "/careers",
  Contact: "/contact",
};

export default function PagesEditor({ fields }: { fields: CopyField[] }) {
  const pages = useMemo(() => [...new Set(fields.map((f) => f.page))], [fields]);
  const [page, setPage] = useState(pages[0] ?? "Home");

  /* `saved` is what the site is serving; `draft` is what the editor holds. The
     difference between them is the change list, and it is also what decides
     whether Publish does anything. */
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [frameKey, setFrameKey] = useState(0);
  const firstLoad = useRef(true);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((d) => {
        const stored: Record<string, string> = {};
        for (const row of d.content || []) stored[row.key] = row.value;
        /* A key with no row falls back to the registry default — the same
           value the site renders. */
        const base: Record<string, string> = {};
        for (const f of fields) base[f.key] = stored[f.key] ?? f.value;
        setSaved(base);
        setDraft(base);
      })
      .catch(() => setNote("Could not load the current text."))
      .finally(() => {
        setLoaded(true);
        firstLoad.current = false;
      });
  }, [fields]);

  const changed = useMemo(
    () => fields.filter((f) => (draft[f.key] ?? "") !== (saved[f.key] ?? "")),
    [fields, draft, saved]
  );

  async function publish() {
    if (!loaded || !changed.length) return;
    setBusy(true);
    setNote("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: changed.map((f) => ({ key: f.key, value: draft[f.key] ?? "" })) }),
      });
      if (!res.ok) throw new Error();
      setSaved({ ...draft });
      setNote(`Published ${changed.length} change${changed.length > 1 ? "s" : ""}.`);
      setFrameKey((k) => k + 1);
    } catch {
      setNote("Could not publish. Nothing was changed.");
    } finally {
      setBusy(false);
    }
  }

  async function resetField(f: CopyField) {
    setDraft((d) => ({ ...d, [f.key]: f.value }));
    if ((saved[f.key] ?? "") === f.value) return;
    await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys: [f.key] }),
    }).catch(() => {});
    setSaved((s) => ({ ...s, [f.key]: f.value }));
    setFrameKey((k) => k + 1);
  }

  const onPage = fields.filter((f) => f.page === page);
  const sections = [...new Set(onPage.map((f) => f.section))];
  const field = "w-full bg-surface border border-line rounded-xl px-4 py-3 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

  return (
    <div className="relative z-10 px-5 sm:px-8 py-10">
      <div className="admin-wide mx-auto max-w-[1500px]">
        <header className="mb-8">
          <p className="mono-label text-accent-deep mb-3">Content</p>
          <h1 className="display text-4xl text-ink">Page text</h1>
          <p className="mt-3 text-graphite max-w-2xl leading-relaxed">
            Change a heading or a paragraph, check the list of what you have changed, then publish.
            Nothing on the site moves until you do.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`mono-label rounded-full border px-4 py-2 transition-colors ${
                p === page ? "border-brand/60 text-brand bg-brand/10" : "border-line text-graphite hover:text-ink"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-10 items-start">
          {/* ---- fields ---- */}
          <div className="space-y-8">
            {sections.map((sec) => (
              <section key={sec} className="rounded-2xl border border-line bg-paper p-6">
                <h2 className="mono-label text-accent-deep mb-5">{sec}</h2>
                <div className="space-y-5">
                  {onPage
                    .filter((f) => f.section === sec)
                    .map((f) => {
                      const dirty = (draft[f.key] ?? "") !== (saved[f.key] ?? "");
                      return (
                        <div key={f.key}>
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <label className="mono-label text-graphite">
                              {f.label}
                              {dirty && <span className="ml-2 text-brand">• changed</span>}
                            </label>
                            {(draft[f.key] ?? "") !== f.value && (
                              <button
                                type="button"
                                onClick={() => resetField(f)}
                                className="mono-label text-graphite hover:text-brand transition-colors"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                          {f.multiline ? (
                            <textarea
                              rows={4}
                              className={field}
                              value={draft[f.key] ?? ""}
                              onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                            />
                          ) : (
                            <input
                              className={field}
                              value={draft[f.key] ?? ""}
                              onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
              </section>
            ))}
          </div>

          {/* ---- what changed, then the live page ---- */}
          <div className="lg:sticky lg:top-6 space-y-6">
            <div className="rounded-2xl border border-line bg-paper p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="mono-label text-accent-deep">
                  {changed.length ? `${changed.length} unpublished change${changed.length > 1 ? "s" : ""}` : "No changes"}
                </h2>
                <button
                  type="button"
                  onClick={publish}
                  disabled={busy || !changed.length}
                  className="btn-cta bg-brand text-white rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-deep transition-colors"
                >
                  {busy ? "Publishing…" : "Publish"}
                </button>
              </div>

              {changed.length > 0 && (
                <ul className="space-y-3 max-h-[260px] overflow-y-auto">
                  {changed.map((f) => (
                    <li key={f.key} className="text-sm">
                      <p className="mono-label text-graphite">{f.page} · {f.section} · {f.label}</p>
                      <p className="mt-1 text-graphite line-through break-words">{saved[f.key]}</p>
                      <p className="text-ink break-words">{draft[f.key]}</p>
                    </li>
                  ))}
                </ul>
              )}
              {note && <p className="mt-4 text-sm text-graphite">{note}</p>}
            </div>

            <div className="rounded-2xl border border-line bg-paper p-3">
              <div className="flex items-center justify-between px-2 pb-3">
                <p className="mono-label text-graphite">Live page: {PAGE_URL[page] ?? "/"}</p>
                <button
                  type="button"
                  onClick={() => setFrameKey((k) => k + 1)}
                  className="mono-label text-graphite hover:text-brand transition-colors"
                >
                  Refresh
                </button>
              </div>
              {/* Shows what is published, which is why the change list above is
                  the preview of what is not. */}
              <iframe
                key={frameKey}
                src={PAGE_URL[page] ?? "/"}
                title={`${page} preview`}
                className="w-full h-[520px] rounded-xl border border-line bg-surface"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
