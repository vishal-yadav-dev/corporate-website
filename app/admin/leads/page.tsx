"use client";

import { useEffect, useState, useCallback } from "react";

type Lead = { id: string; source: string; name: string; email: string; company: string | null; phone: string | null; practice: string | null; message: string; status: string; created_at: string };

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  // Distinguishes "not fetched yet" from "fetched and genuinely empty".
  const [loaded, setLoaded] = useState(false);
  const [source, setSource] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(() => {
    const p = new URLSearchParams({ source, status });
    fetch(`/api/admin/leads?${p}`).then((r) => r.json()).then((d) => setLeads(d.leads || [])).catch(() => {}).finally(() => setLoaded(true));
  }, [source, status]);
  useEffect(() => { load(); }, [load]);

  async function setLeadStatus(id: string, s: string) {
    await fetch(`/api/admin/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: s }) });
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    load();
  }

  const pill = (s: string) => s === "new" ? "bg-accent/15 text-accent-deep" : s === "read" ? "bg-brand/10 text-brand" : "bg-graphite/10 text-graphite";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="mono-label text-accent-deep mb-2">Leads</p>
          <h1 className="display text-4xl text-ink">Enquiries & contacts</h1>
        </div>
        <a href={`/api/admin/leads?source=${source}&status=${status}&format=csv`} className="bg-surface border border-line rounded-full px-5 py-2.5 text-sm hover:border-brand hover:text-brand transition-colors">
          Export CSV ↓
        </a>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "contact", "enquiry"].map((s) => (
          <button key={s} onClick={() => setSource(s)} className={`mono-label px-4 py-2 rounded-full border transition-colors ${source === s ? "bg-brand text-white border-brand" : "border-line text-graphite hover:border-brand"}`}>{s}</button>
        ))}
        <span className="w-px bg-line mx-1" />
        {["all", "new", "read", "archived"].map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`mono-label px-4 py-2 rounded-full border transition-colors ${status === s ? "bg-ink text-white border-ink" : "border-line text-graphite hover:border-ink"}`}>{s}</button>
        ))}
      </div>

      <div className="bg-surface border border-line rounded-2xl overflow-hidden">
        {!loaded ? <p className="p-8 text-center text-graphite">Loading…</p> : leads.length === 0 ? <p className="p-8 text-center text-graphite">No leads yet.</p> : null}
        {leads.map((l) => (
          <div key={l.id} className="border-b border-line last:border-0">
            <button onClick={() => setOpen(open === l.id ? null : l.id)} className="w-full text-left px-5 py-4 hover:bg-paper-tint transition-colors grid grid-cols-[1fr_auto] gap-3 items-center">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-ink">{l.name}</span>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${pill(l.status)}`}>{l.status}</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-paper-tint text-graphite">{l.source}</span>
                </div>
                <p className="text-sm text-graphite truncate">{l.email}{l.company ? ` · ${l.company}` : ""}{l.practice ? ` · ${l.practice}` : ""}</p>
              </div>
              <span className="text-xs text-graphite whitespace-nowrap">{new Date(l.created_at).toLocaleDateString()}</span>
            </button>
            {open === l.id && (
              <div className="px-5 pb-5 bg-paper-tint/40">
                <p className="text-sm text-ink whitespace-pre-wrap py-3">{l.message}</p>
                {l.phone && <p className="text-sm text-graphite">Phone: {l.phone}</p>}
                <div className="flex flex-wrap gap-2 mt-3">
                  {l.status !== "read" && <button onClick={() => setLeadStatus(l.id, "read")} className="text-xs bg-brand text-white px-3 py-1.5 rounded-full">Mark read</button>}
                  {l.status !== "archived" && <button onClick={() => setLeadStatus(l.id, "archived")} className="text-xs bg-surface border border-line px-3 py-1.5 rounded-full hover:border-ink">Archive</button>}
                  {l.status !== "new" && <button onClick={() => setLeadStatus(l.id, "new")} className="text-xs bg-surface border border-line px-3 py-1.5 rounded-full hover:border-ink">Mark new</button>}
                  <a href={`mailto:${l.email}`} className="text-xs bg-surface border border-line px-3 py-1.5 rounded-full hover:border-brand hover:text-brand">Reply</a>
                  <button onClick={() => remove(l.id)} className="text-xs text-accent-deep px-3 py-1.5 rounded-full hover:underline ml-auto">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
