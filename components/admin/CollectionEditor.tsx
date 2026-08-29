"use client";

import { useCallback, useEffect, useState } from "react";

export type EditorField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "image" | "select";
  placeholder?: string;
  options?: string[];
  help?: string;
  full?: boolean;
};

type Item = Record<string, unknown> & { id: string };

const input =
  "w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

export default function CollectionEditor({
  type,
  title,
  description,
  fields,
  defaults,
  imageSlot,
  renderPreview,
}: {
  type: string;
  title: string;
  description: string;
  fields: EditorField[];
  defaults: Record<string, unknown>;
  imageSlot?: string;
  renderPreview: (item: Record<string, unknown>) => React.ReactNode;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>(defaults);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState("");

  const load = useCallback(() => {
    fetch(`/api/admin/collections/${type}`).then((r) => r.json()).then((d) => setItems(d.items || []));
  }, [type]);
  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function upload(key: string, file: File) {
    setUploading(key); setErr("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      if (imageSlot) fd.set("slot", imageSlot);
      fd.set("alt", String(form.name || form.region || title));
      const res = await fetch("/api/admin/images", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setForm((f) => ({ ...f, [key]: data.image.id, [`${key.replace("_id", "")}_url`]: "" }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading("");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const url = editingId
        ? `/api/admin/collections/${type}/${editingId}`
        : `/api/admin/collections/${type}`;
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save.");
      setForm(defaults); setEditingId(null); load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(it: Item) {
    const next: Record<string, unknown> = { ...defaults };
    for (const f of fields) next[f.key] = it[f.key] ?? defaults[f.key] ?? "";
    setForm(next);
    setEditingId(it.id);
    setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: string) {
    if (!confirm("Delete this entry?")) return;
    const res = await fetch(`/api/admin/collections/${type}/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center">
        <p className="mono-label text-accent-deep mb-2">{title}</p>
        <h1 className="display text-3xl text-ink">{title}</h1>
        <p className="mt-2 text-graphite text-sm max-w-xl mx-auto">{description}</p>
      </div>

      <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-6">
        <form onSubmit={submit} className="bg-surface border border-line rounded-2xl p-6 space-y-4">
          <h2 className="display text-lg text-ink">{editingId ? "Edit entry" : "New entry"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="mono-label text-graphite block mb-1.5">{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea className={`${input} min-h-[90px] resize-y`} value={String(form[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} />
                ) : f.type === "checkbox" ? (
                  <label className="flex items-center gap-2 py-2 cursor-pointer select-none">
                    <input type="checkbox" checked={Boolean(form[f.key])} onChange={(e) => set(f.key, e.target.checked)} className="w-4 h-4 accent-brand" />
                    <span className="text-sm text-ink">{f.help || "Enabled"}</span>
                  </label>
                ) : f.type === "number" ? (
                  <input type="number" className={input} value={String(form[f.key] ?? "0")} onChange={(e) => set(f.key, e.target.value)} />
                ) : f.type === "select" ? (
                  <select className={input} value={String(form[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)}>
                    {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === "image" ? (
                  <div className="flex items-center gap-3">
                    {form[f.key] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/api/images/${form[f.key]}`} alt="" className="h-9 w-auto max-w-[120px] object-contain bg-paper-tint rounded" />
                    ) : null}
                    <label className="text-xs bg-brand text-white px-3 py-1.5 rounded-full cursor-pointer hover:bg-brand-deep">
                      {uploading === f.key ? "Uploading…" : form[f.key] ? "Replace" : "Upload"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(f.key, file); }} />
                    </label>
                    {form[f.key] ? (
                      <button type="button" onClick={() => set(f.key, "")} className="text-xs text-accent-deep hover:underline">Clear</button>
                    ) : null}
                  </div>
                ) : (
                  <input className={input} value={String(form[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} />
                )}
                {f.help && f.type !== "checkbox" && <p className="text-[11px] text-graphite/70 mt-1">{f.help}</p>}
              </div>
            ))}
          </div>

          {err && <p className="text-sm text-accent-deep">{err}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={busy} className="bg-brand text-white px-5 py-2.5 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
              {busy ? "Saving…" : editingId ? "Save changes" : "Add entry"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(defaults); }} className="border border-line text-graphite px-5 py-2.5 rounded-full font-medium hover:border-ink hover:text-ink transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Live preview */}
        <div className="lg:sticky lg:top-24 self-start">
          <p className="mono-label text-graphite mb-2">Live preview</p>
          <div className="bg-paper border border-line rounded-2xl p-4">
            {renderPreview(form)}
          </div>
        </div>
      </div>

      <h2 className="display text-xl text-ink mt-10 mb-4">All entries ({items.length})</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.id} className="bg-surface border border-line rounded-2xl p-3">
            <div className="border border-line/60 rounded-xl p-3 mb-3">{renderPreview(it)}</div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => startEdit(it)} className="text-xs bg-surface border border-line text-ink px-3 py-1.5 rounded-full hover:border-graphite">Edit</button>
              <button onClick={() => remove(it.id)} className="text-xs text-accent-deep hover:underline px-2">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
