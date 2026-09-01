"use client";
import { useEffect, useState, useCallback, useRef } from "react";

type Img = { id: string; slot: string | null; alt: string; mime_type: string; size: number; created_at: string };

export default function ImagesPage() {
  const [images, setImages] = useState<Img[]>([]);
  // Distinguishes "not fetched yet" from "fetched and genuinely empty".
  const [loaded, setLoaded] = useState(false);
  const [slot, setSlot] = useState(""); const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const load = useCallback(() => { fetch("/api/admin/images").then((r) => r.json()).then((d) => setImages(d.images || [])).catch(() => {}).finally(() => setLoaded(true)); }, []);
  useEffect(() => { load(); }, [load]);

  async function upload(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const file = fileRef.current?.files?.[0];
    if (!file) { setErr("Choose a file."); return; }
    setBusy(true);
    const fd = new FormData(); fd.append("file", file); if (slot) fd.append("slot", slot); if (alt) fd.append("alt", alt);
    const res = await fetch("/api/admin/images", { method: "POST", body: fd });
    const d = await res.json(); setBusy(false);
    if (!res.ok) { setErr(d.error || "Upload failed."); return; }
    setSlot(""); setAlt(""); if (fileRef.current) fileRef.current.value = ""; load();
  }
  async function remove(id: string) { if (!confirm("Delete this image?")) return; await fetch(`/api/admin/images/${id}`, { method: "DELETE" }); load(); }
  const kb = (n: number) => `${Math.round(n / 1024)} KB`;
  const field = "w-full bg-surface border border-line rounded-xl px-4 py-3 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

  return (
    <div>
      <p className="mono-label text-accent-deep mb-2">Media</p>
      <h1 className="display text-4xl text-ink">Media library</h1>
      <p className="mt-3 text-graphite">Upload images and videos, and assign a slot (e.g. <code className="text-brand">hero</code>) to place them on the site. Max 20MB.</p>

      <form onSubmit={upload} className="mt-8 bg-surface border border-line rounded-2xl p-6 grid sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-1">
          <label className="mono-label text-graphite block mb-2">File</label>
          <input ref={fileRef} type="file" accept="image/*,video/*" className="text-sm text-graphite file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-brand file:text-white file:text-sm cursor-pointer" />
        </div>
        <div><label className="mono-label text-graphite block mb-2">Slot (optional)</label><input className={field} value={slot} onChange={(e) => setSlot(e.target.value)} placeholder="hero" /></div>
        <div><label className="mono-label text-graphite block mb-2">Alt text / Description</label><input className={field} value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Description" /></div>
        {err && <p className="sm:col-span-3 text-sm text-accent-deep">{err}</p>}
        <div className="sm:col-span-3"><button disabled={busy} className="bg-brand text-white px-6 py-3 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">{busy ? "Uploading…" : "Upload media"}</button></div>
      </form>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {!loaded ? <p className="col-span-full text-graphite">Loading…</p> : images.length === 0 ? <p className="col-span-full text-graphite">No media items yet.</p> : null}
        {images.map((img) => {
          const isVideo = img.mime_type.startsWith("video/");
          return (
            <div key={img.id} className="bg-surface border border-line rounded-2xl overflow-hidden group relative flex flex-col justify-between">
              <div className="relative h-36 bg-paper-tint overflow-hidden flex items-center justify-center">
                {isVideo ? (
                  <video
                    src={`/api/images/${img.id}`}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/api/images/${img.id}`} alt={img.alt} className="w-full h-full object-cover" />
                )}
                {isVideo && (
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded-md flex items-center gap-1 pointer-events-none">
                    <span>▶</span>
                    <span>Video</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-surface border-t border-line/50">
                {img.slot && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand/10 text-brand inline-block mb-1">{img.slot}</span>}
                <p className="text-xs text-graphite truncate">{img.alt || "—"}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-graphite">{kb(img.size)}</span>
                  <button onClick={() => remove(img.id)} className="text-[11px] text-accent-deep hover:underline">Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
