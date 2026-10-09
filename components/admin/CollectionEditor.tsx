"use client";

import { useCallback, useEffect, useState } from "react";
import FocalDrag from "@/components/admin/FocalDrag";
import { PreviewLink, useDraftMirror, useDraftPatches, useSaveRequests, type SaveResult } from "@/components/admin/preview";
import { joinImage, splitImage } from "@/lib/blog";

export type EditorField = {
  key: string;
  label: string;
  /** `image` keeps an upload's id in a `<name>_id` column; `photo` keeps its
   *  address in the field itself, for a table that only has a URL column. */
  type: "text" | "textarea" | "number" | "checkbox" | "image" | "photo" | "select";
  placeholder?: string;
  options?: string[];
  help?: string;
  full?: boolean;
  /** `photo` only: the shape the page crops the picture to, as an aspect class.
   *  Given one, the picture is shown cropped that way and can be dragged. */
  frame?: string;
};

type Item = Record<string, unknown> & { id: string };

const input =
  "w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

/* The host turns away a request body over 4.5 MB before the upload route runs,
   and a photo straight off a camera or a stock site is larger than that. A
   picture is never shown wider than the page, so a big one is scaled down in
   the browser first. Anything the browser cannot redraw goes up untouched. */
const MAX_EDGE = 2000;
const MAX_UNTOUCHED = 3 * 1024 * 1024;

async function shrink(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size <= MAX_UNTOUCHED) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/jpeg", 0.86));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.\w+$/, "")}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function PhotoField({ value, frame, busy, onPick, onChange }: {
  value: string;
  frame?: string;
  busy: boolean;
  onPick: (file: File) => void;
  onChange: (value: string) => void;
}) {
  const { src, x, y } = splitImage(value);
  const buttons = (
    <>
      <label className="text-xs bg-brand text-white px-3 py-1.5 rounded-full cursor-pointer hover:bg-brand-deep">
        {busy ? "Uploading…" : src ? "Replace" : "Upload"}
        {/* Cleared after each pick, or choosing the same file again would not fire. */}
        <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; if (file) onPick(file); }} />
      </label>
      {src ? (
        <button type="button" onClick={() => onChange("")} className="text-xs text-accent-deep hover:underline">Remove</button>
      ) : null}
    </>
  );

  if (frame && src) {
    return (
      <div>
        <div className="relative overflow-hidden rounded-xl border border-line bg-paper-tint">
          <FocalDrag src={src} x={x} y={y} className={`block w-full object-cover ${frame}`} onChange={(nx, ny) => onChange(joinImage(src, nx, ny))} />
        </div>
        <div className="mt-3 flex items-center gap-4">
          {buttons}
          {x !== 50 || y !== 50 ? (
            <button type="button" onClick={() => onChange(src)} className="text-xs text-graphite hover:text-ink hover:underline">Centre</button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-20 w-32 shrink-0 object-cover bg-paper-tint rounded-xl border border-line" />
      ) : (
        <div className="h-20 w-32 shrink-0 grid place-items-center rounded-xl border border-dashed border-line text-[11px] text-graphite/70">No image</div>
      )}
      {buttons}
    </div>
  );
}

export default function CollectionEditor({
  type,
  title,
  description,
  fields,
  defaults,
  imageSlot,
  renderPreview,
  previewKind,
  viewHref,
}: {
  type: string;
  title: string;
  description: string;
  fields: EditorField[];
  defaults: Record<string, unknown>;
  imageSlot?: string;
  renderPreview: (item: Record<string, unknown>) => React.ReactNode;
  /** Set when /preview/<kind> can render this form as the full page, before saving. */
  previewKind?: string;
  /** Where a saved entry appears on the site, for a "View on site" link. */
  viewHref?: (item: Record<string, unknown>) => string | null;
}) {
  const [items, setItems] = useState<Item[]>([]);
  // "0 entries" before the fetch resolves is a lie; track whether it has.
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>(defaults);
  /* The form as it was last saved or opened. Saving is offered only while the
     form differs from it. Compared as text, field by field: a number retyped
     in its box comes back as a string and is not a change. */
  const [saved, setSaved] = useState<Record<string, unknown>>(defaults);
  const dirty = fields.some((f) => String(form[f.key] ?? "") !== String(saved[f.key] ?? ""));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState("");

  const load = useCallback(() => {
    fetch(`/api/admin/collections/${type}`).then((r) => r.json()).then((d) => setItems(d.items || [])).catch(() => {}).finally(() => setLoaded(true));
  }, [type]);
  useEffect(() => { load(); }, [load]);

  useDraftMirror(previewKind ?? type, form, Boolean(previewKind), dirty);
  useDraftPatches(previewKind ?? type, (patch) => {
    const known = Object.entries(patch).filter(([k]) => fields.some((f) => f.key === k));
    setForm((f) => ({ ...f, ...Object.fromEntries(known) }));
  }, Boolean(previewKind));

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function upload(field: EditorField, file: File) {
    const key = field.key;
    const photo = field.type === "photo";
    setUploading(key); setErr("");
    try {
      const fd = new FormData();
      fd.set("file", photo ? await shrink(file) : file);
      if (imageSlot) fd.set("slot", imageSlot);
      fd.set("alt", String(form.image_alt || form.name || form.region || form.title || title));
      const res = await fetch("/api/admin/images", { method: "POST", body: fd });
      // A file the host refuses for its size is answered with a page, not JSON.
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || (res.status === 413 ? "That file is too large to upload." : "Upload failed."));
      setForm((f) => photo
        ? { ...f, [key]: `/api/images/${data.image.id}` }
        : { ...f, [key]: data.image.id, [`${key.replace("_id", "")}_url`]: "" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading("");
    }
  }

  /* `stay` keeps the saved entry open instead of clearing the form. A save asked
     for by the preview tab uses it: an emptied form would empty the page the
     editor is looking at, and the next change should update the same entry. */
  async function save(stay = false): Promise<SaveResult> {
    if (busy) return { ok: false, message: "Already saving." };
    if (!dirty) return { ok: false, message: "Nothing has changed since the last save." };
    if (uploading) return { ok: false, message: "A picture is still uploading. Try again in a moment." };
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
      if (stay) { setEditingId(data.item.id); setSaved(form); }
      else { setForm(defaults); setSaved(defaults); setEditingId(null); }
      load();
      return { ok: true, message: "", href: viewHref?.(data.item) ?? undefined };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not save.";
      setErr(message);
      return { ok: false, message };
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await save();
  }

  useSaveRequests(previewKind ?? type, form, () => save(true), Boolean(previewKind));

  function startEdit(it: Item) {
    const next: Record<string, unknown> = { ...defaults };
    for (const f of fields) next[f.key] = it[f.key] ?? defaults[f.key] ?? "";
    setForm(next);
    setSaved(next);
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
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(f, file); }} />
                    </label>
                    {form[f.key] ? (
                      <button type="button" onClick={() => set(f.key, "")} className="text-xs text-accent-deep hover:underline">Clear</button>
                    ) : null}
                  </div>
                ) : f.type === "photo" ? (
                  <PhotoField
                    value={String(form[f.key] ?? "")}
                    frame={f.frame}
                    busy={uploading === f.key}
                    onPick={(file) => upload(f, file)}
                    onChange={(v) => set(f.key, v)}
                  />
                ) : (
                  <input className={input} value={String(form[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} />
                )}
                {f.help && f.type !== "checkbox" && <p className="text-[11px] text-graphite/70 mt-1">{f.help}</p>}
              </div>
            ))}
          </div>

          {err && <p className="text-sm text-accent-deep">{err}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={busy || Boolean(uploading) || !dirty} title={dirty ? undefined : "Nothing has changed"} className="bg-brand text-white px-5 py-2.5 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand">
              {busy ? "Saving…" : editingId ? "Save changes" : "Add entry"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(defaults); setSaved(defaults); }} className="border border-line text-graphite px-5 py-2.5 rounded-full font-medium hover:border-ink hover:text-ink transition-colors">
                Cancel
              </button>
            )}
            {previewKind && <PreviewLink kind={previewKind} />}
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

      <h2 className="display text-xl text-ink mt-10 mb-4">All entries ({loaded ? items.length : "…"})</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {!loaded && (
          <p className="col-span-full text-sm text-graphite">Loading…</p>
        )}
        {items.map((it) => (
          <div key={it.id} className="bg-surface border border-line rounded-2xl p-3">
            <div className="border border-line/60 rounded-xl p-3 mb-3">{renderPreview(it)}</div>
            <div className="flex items-center gap-2 justify-end">
              {viewHref?.(it) && (
                <a href={viewHref(it)!} target="_blank" rel="noreferrer" className="text-xs text-accent-deep hover:underline mr-auto pl-1">
                  View on site ↗
                </a>
              )}
              <button onClick={() => startEdit(it)} className="text-xs bg-surface border border-line text-ink px-3 py-1.5 rounded-full hover:border-graphite">Edit</button>
              <button onClick={() => remove(it.id)} className="text-xs text-accent-deep hover:underline px-2">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
