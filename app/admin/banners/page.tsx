"use client";

import { useEffect, useState, useCallback } from "react";

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_url: string;
  media_id: string | null;
  sort_order: number;
  background_fx: string;
  is_active: boolean;
  media_mime_type: string | null;
  media_alt: string | null;
};

// Animated 3D backgrounds available per banner (empty = plain gradient)
export const BANNER_FX = [
  { value: "", label: "None (plain gradient)" },
  { value: "halo", label: "Halo" },
  { value: "birds", label: "Birds" },
  { value: "net", label: "Net" },
  { value: "dots", label: "Dots" },
  { value: "rings", label: "Rings" },
  { value: "globe", label: "Globe" },
  { value: "waves", label: "Waves" },
  { value: "fog", label: "Fog" },
  { value: "cells", label: "Cells" },
  { value: "clouds", label: "Clouds" },
  { value: "topology", label: "Topology" },
];

type MediaItem = {
  id: string;
  slot: string | null;
  alt: string;
  mime_type: string;
  size: number;
};

const emptyForm = {
  title: "",
  subtitle: "",
  cta_text: "",
  cta_url: "",
  media_id: "",
  sort_order: "0",
  background_fx: "",
  is_active: true,
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  // Distinguishes "not fetched yet" from "fetched and genuinely empty".
  const [loaded, setLoaded] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const loadBanners = useCallback(() => {
    fetch("/api/admin/banners")
      .then((r) => r.json())
      .then((d) => setBanners(d.banners || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const loadMedia = useCallback(() => {
    fetch("/api/admin/images")
      .then((r) => r.json())
      .then((d) => setMediaItems(d.images || []));
  }, []);

  useEffect(() => {
    loadBanners();
    loadMedia();
  }, [loadBanners, loadMedia]);

  const setField = (k: string, v: unknown) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);

    const payload = {
      ...form,
      sort_order: parseInt(form.sort_order, 10) || 0,
      background_fx: form.background_fx,
      media_id: form.media_id || null,
    };

    try {
      const url = editingId ? `/api/admin/banners/${editingId}` : "/api/admin/banners";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save banner.");

      setForm(emptyForm);
      setEditingId(null);
      loadBanners();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save banner.");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(banner: Banner) {
    setEditingId(banner.id);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle,
      cta_text: banner.cta_text,
      cta_url: banner.cta_url,
      media_id: banner.media_id || "",
      sort_order: String(banner.sort_order),
      background_fx: banner.background_fx || "",
      is_active: banner.is_active,
    });
    setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setErr("");
  }

  async function toggleActive(banner: Banner) {
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: banner.title,
          subtitle: banner.subtitle,
          cta_text: banner.cta_text,
          cta_url: banner.cta_url,
          media_id: banner.media_id,
          sort_order: banner.sort_order,
          background_fx: banner.background_fx,
          is_active: !banner.is_active,
        }),
      });
      if (res.ok) loadBanners();
    } catch (err) {
      console.error("Failed to toggle banner status", err);
    }
  }

  async function removeBanner(id: string) {
    if (!confirm("Delete this banner?")) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (res.ok) loadBanners();
    } catch (err) {
      console.error("Failed to delete banner", err);
    }
  }

  const fieldStyle = "w-full bg-surface border border-line rounded-xl px-4 py-3 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

  return (
    <div>
      <p className="mono-label text-accent-deep mb-2">Banners</p>
      <h1 className="display text-4xl text-ink">Homepage Banners</h1>
      <p className="mt-3 text-graphite">
        Manage the rotating banners for the website's main hero section. Slides can display background images or videos.
      </p>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mt-8 bg-surface border border-line rounded-2xl p-6 space-y-4 max-w-3xl">
        <h2 className="display text-xl text-ink">
          {editingId ? "Edit banner slide" : "Create new banner slide"}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="mono-label text-graphite block mb-2">Title</label>
            <input
              className={fieldStyle}
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="Enterprise software, delivered."
            />
          </div>
          
          <div className="sm:col-span-2">
            <label className="mono-label text-graphite block mb-2">Subtitle</label>
            <textarea
              className={`${fieldStyle} min-h-[80px] resize-y`}
              value={form.subtitle}
              onChange={(e) => setField("subtitle", e.target.value)}
              placeholder="We architect, implement, and run the platforms that keep enterprises moving."
            />
          </div>

          <div>
            <label className="mono-label text-graphite block mb-2">CTA Button Text</label>
            <input
              className={fieldStyle}
              value={form.cta_text}
              onChange={(e) => setField("cta_text", e.target.value)}
              placeholder="Explore our practices"
            />
          </div>

          <div>
            <label className="mono-label text-graphite block mb-2">CTA Button Link</label>
            <input
              className={fieldStyle}
              value={form.cta_url}
              onChange={(e) => setField("cta_url", e.target.value)}
              placeholder="/practices"
            />
          </div>

          <div>
            <label className="mono-label text-graphite block mb-2">Background Media</label>
            <select
              className={fieldStyle}
              value={form.media_id}
              onChange={(e) => setField("media_id", e.target.value)}
            >
              <option value="">-- No Media (Text Only) --</option>
              {mediaItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.slot ? `[${item.slot.toUpperCase()}] ` : ""}
                  {item.mime_type.startsWith("video/") ? "📹 " : "🖼️ "}
                  {item.alt || `File (${item.id.substring(0, 8)})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mono-label text-graphite block mb-2">Sort Order</label>
            <input
              type="number"
              className={fieldStyle}
              value={form.sort_order}
              onChange={(e) => setField("sort_order", e.target.value)}
            />
            <p className="text-[11px] text-graphite/70 mt-1">Lower number shows first.</p>
          </div>

          <div>
            <label className="mono-label text-graphite block mb-2">Animated 3D background</label>
            <select
              className={fieldStyle}
              value={form.background_fx}
              onChange={(e) => setField("background_fx", e.target.value)}
            >
              {BANNER_FX.map((fx) => (
                <option key={fx.value} value={fx.value}>{fx.label}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setField("is_active", e.target.checked)}
              className="w-4 h-4 rounded text-brand border-line focus:ring-brand focus:ring-opacity-25"
            />
            <label htmlFor="is_active" className="mono-label text-ink cursor-pointer select-none">
              Visible on homepage
            </label>
          </div>
        </div>

        {err && <p className="text-sm text-accent-deep">{err}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={busy}
            className="bg-brand text-white px-6 py-3 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50"
          >
            {busy ? "Saving…" : editingId ? "Save changes" : "Add banner slide"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="border border-line text-graphite px-6 py-3 rounded-full font-medium hover:border-ink hover:text-ink transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Banner List */}
      <h2 className="display text-2xl text-ink mt-12 mb-6">Current Banners</h2>
      <div className="space-y-4 max-w-4xl">
        {!loaded ? (
          <div className="bg-surface border border-line rounded-2xl p-8 text-center text-graphite">Loading…</div>
        ) : banners.length === 0 ? (
          <div className="bg-surface border border-line rounded-2xl p-8 text-center text-graphite">
            No banners created yet. Create one above to customize the homepage slider!
          </div>
        ) : null}
        {banners.map((b) => {
          const isVideo = b.media_mime_type?.startsWith("video/");
          return (
            <div
              key={b.id}
              className="bg-surface border border-line rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              <div className="flex gap-4 items-start min-w-0 flex-1">
                {/* Media Thumbnail */}
                <div className="w-24 h-16 rounded-xl border border-line/60 bg-paper-tint overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                  {b.media_id ? (
                    isVideo ? (
                      <video
                        src={`/api/images/${b.media_id}`}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/images/${b.media_id}`}
                        alt={b.media_alt || ""}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <span className="text-[10px] text-graphite/40">No media</span>
                  )}
                  {b.media_id && isVideo && (
                    <span className="absolute bottom-1 right-1 bg-black/60 text-[8px] text-white px-1 py-0.2 rounded-xs">
                      ▶
                    </span>
                  )}
                </div>

                {/* Banner Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-ink truncate max-w-md">{b.title || "—"}</h3>
                    <span className="text-xs bg-paper border border-line text-graphite px-2 py-0.5 rounded-full">
                      Order: {b.sort_order}
                    </span>
                    {b.background_fx && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand/10 text-brand font-semibold">
                        {b.background_fx}
                      </span>
                    )}
                    {!b.is_active && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-graphite/10 text-graphite font-semibold">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-graphite truncate mt-1">{b.subtitle || "—"}</p>
                  <div className="flex gap-3 mt-2 text-[11px] text-graphite">
                    <span>
                      CTA: <strong>{b.cta_text || "—"}</strong>
                    </span>
                    <span>
                      Link: <strong>{b.cta_url || "—"}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-line/60">
                <button
                  onClick={() => toggleActive(b)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    b.is_active
                      ? "bg-surface border-line text-ink hover:border-graphite"
                      : "bg-brand/10 border-brand/20 text-brand hover:bg-brand/20"
                  }`}
                >
                  {b.is_active ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => startEdit(b)}
                  className="text-xs bg-surface border border-line text-ink px-3 py-1.5 rounded-full hover:border-graphite transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeBanner(b.id)}
                  className="text-xs text-accent-deep hover:underline px-3 py-1.5"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
