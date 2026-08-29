"use client";
import { useEffect, useState } from "react";

const DEFAULTS = [
  { key: "hero.eyebrow", label: "Hero eyebrow", value: "Inc. 500 · Enterprise Application Partner" },
  { key: "hero.title", label: "Hero title", value: "Enterprise software, delivered." },
  { key: "hero.subtitle", label: "Hero subtitle", value: "We architect, implement, and run the platforms that keep enterprises moving." },
  { key: "cta.heading", label: "Footer CTA heading", value: "Ready to modernize your core systems?" },
];

export default function ContentPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false); const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content").then((r) => r.json()).then((d) => {
      const map: Record<string, string> = {};
      for (const row of d.content || []) map[row.key] = row.value;
      const merged: Record<string, string> = {};
      for (const f of DEFAULTS) merged[f.key] = map[f.key] ?? f.value;
      setValues(merged);
    });
  }, []);

  async function save() {
    setBusy(true); setSaved(false);
    const entries = DEFAULTS.map((f) => ({ key: f.key, value: values[f.key] ?? "" }));
    await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ entries }) });
    setBusy(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  }
  const field = "w-full bg-surface border border-line rounded-xl px-4 py-3 text-ink focus:border-brand focus:outline-none transition-colors";

  return (
    <div>
      <p className="mono-label text-accent-deep mb-2">Content</p>
      <h1 className="display text-4xl text-ink">Editable site copy</h1>
      <p className="mt-3 text-graphite">Update key text blocks. Changes are stored and served to the site.</p>
      <div className="mt-8 bg-surface border border-line rounded-2xl p-6 space-y-5 max-w-2xl">
        {DEFAULTS.map((f) => (
          <div key={f.key}>
            <label className="mono-label text-graphite block mb-2">{f.label}</label>
            <input className={field} value={values[f.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={busy} className="bg-brand text-white px-6 py-3 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">{busy ? "Saving…" : "Save changes"}</button>
          {saved && <span className="text-sm text-brand">Saved ✓</span>}
        </div>
      </div>
    </div>
  );
}
