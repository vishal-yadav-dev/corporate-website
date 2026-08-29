"use client";

import { useCallback, useEffect, useState } from "react";

type Leader = {
  id: string;
  name: string;
  title: string;
  bio: string;
  linkedin_url: string;
  photo_id: string | null;
  photo_url: string;
  sort_order: number;
  is_active: boolean;
};

const emptyForm = {
  name: "", title: "", bio: "", linkedin_url: "", photo_id: "", photo_url: "",
  sort_order: "0", is_active: true,
};

const field =
  "w-full bg-surface border border-line rounded-xl px-4 py-3 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

export default function LeadershipAdminPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(() => {
    fetch("/api/admin/leaders").then((r) => r.json()).then((d) => setLeaders(d.leaders || []));
  }, []);
  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function uploadPhoto(file: File) {
    setUploading(true); setErr("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("slot", "leader");
      fd.set("alt", form.name || "Leadership photo");
      const res = await fetch("/api/admin/images", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setForm((f) => ({ ...f, photo_id: data.image.id, photo_url: "" }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const payload = {
        ...form,
        sort_order: parseInt(form.sort_order, 10) || 0,
        photo_id: form.photo_id || null,
      };
      const url = editingId ? `/api/admin/leaders/${editingId}` : "/api/admin/leaders";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save.");
      setForm(emptyForm); setEditingId(null); load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(l: Leader) {
    setEditingId(l.id);
    setForm({
      name: l.name, title: l.title, bio: l.bio, linkedin_url: l.linkedin_url,
      photo_id: l.photo_id || "", photo_url: l.photo_url,
      sort_order: String(l.sort_order), is_active: l.is_active,
    });
    setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() { setEditingId(null); setForm(emptyForm); setErr(""); }

  async function remove(id: string) {
    if (!confirm("Remove this leader?")) return;
    const res = await fetch(`/api/admin/leaders/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  const preview = form.photo_id ? `/api/images/${form.photo_id}` : form.photo_url || "";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <p className="mono-label text-accent-deep mb-2">Leadership</p>
        <h1 className="display text-4xl text-ink">Leadership team</h1>
        <p className="mt-3 text-graphite">
          Add the people shown on the Company page. Upload a headshot or paste an image URL —
          if neither is set, a clean initials avatar is used automatically.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 bg-surface border border-line rounded-2xl p-6 sm:p-8 space-y-5">
        <h2 className="display text-xl text-ink text-center">{editingId ? "Edit leader" : "Add a leader"}</h2>

        <div className="flex flex-col items-center gap-3">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-brand text-white grid place-items-center display text-2xl">
            {preview
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={preview} alt="" className="h-full w-full object-cover" />
              : (initials(form.name) || "—")}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs bg-brand text-white px-4 py-2 rounded-full cursor-pointer hover:bg-brand-deep">
              {uploading ? "Uploading…" : "Upload photo"}
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }} />
            </label>
            {(form.photo_id || form.photo_url) && (
              <button type="button" onClick={() => setForm((f) => ({ ...f, photo_id: "", photo_url: "" }))}
                className="text-xs text-accent-deep hover:underline">Clear</button>
            )}
          </div>
        </div>

        <div>
          <label className="mono-label text-graphite block mb-2">Full name</label>
          <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Venkat Yerubandi" />
        </div>
        <div>
          <label className="mono-label text-graphite block mb-2">Designation / title</label>
          <input className={field} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Founder" />
        </div>
        <div>
          <label className="mono-label text-graphite block mb-2">About</label>
          <textarea className={`${field} min-h-[110px] resize-y`} value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Short bio shown on the card." />
        </div>
        <div>
          <label className="mono-label text-graphite block mb-2">LinkedIn URL</label>
          <input className={field} value={form.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} placeholder="https://www.linkedin.com/in/…" />
        </div>
        <div>
          <label className="mono-label text-graphite block mb-2">Photo URL <span className="text-graphite/50">(optional — used if no upload)</span></label>
          <input className={field} value={form.photo_url} onChange={(e) => set("photo_url", e.target.value)} placeholder="https://…/headshot.jpg" disabled={!!form.photo_id} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mono-label text-graphite block mb-2">Sort order</label>
            <input type="number" className={field} value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
          </div>
          <label className="flex items-end gap-2 pb-3 cursor-pointer select-none">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} className="w-4 h-4 accent-brand" />
            <span className="mono-label text-ink">Show on site</span>
          </label>
        </div>

        {err && <p className="text-sm text-accent-deep text-center">{err}</p>}

        <div className="flex gap-3 justify-center pt-1">
          <button type="submit" disabled={busy} className="bg-brand text-white px-6 py-3 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
            {busy ? "Saving…" : editingId ? "Save changes" : "Add leader"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="border border-line text-graphite px-6 py-3 rounded-full font-medium hover:border-ink hover:text-ink transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="display text-2xl text-ink mt-12 mb-6 text-center">Current team</h2>
      <div className="space-y-3">
        {leaders.length === 0 && (
          <div className="bg-surface border border-line rounded-2xl p-8 text-center text-graphite">
            No leaders yet. Add the first one above.
          </div>
        )}
        {leaders.map((l) => {
          const src = l.photo_id ? `/api/images/${l.photo_id}` : l.photo_url;
          return (
            <div key={l.id} className="bg-surface border border-line rounded-2xl p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-brand text-white grid place-items-center display text-sm shrink-0">
                {src
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={src} alt={l.name} className="h-full w-full object-cover" />
                  : initials(l.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-ink truncate">{l.name}</h3>
                  {!l.is_active && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-graphite/10 text-graphite font-semibold">Hidden</span>}
                </div>
                <p className="text-xs text-graphite truncate">{l.title || "—"} · order {l.sort_order}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(l)} className="text-xs bg-surface border border-line text-ink px-3 py-1.5 rounded-full hover:border-graphite">Edit</button>
                <button onClick={() => remove(l.id)} className="text-xs text-accent-deep hover:underline px-2">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
