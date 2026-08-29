"use client";
import { useEffect, useState, useCallback } from "react";

type Sub = { id: string; email: string; status: string; created_at: string };

export default function SubscribersPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const load = useCallback(() => { fetch("/api/admin/subscribers").then((r) => r.json()).then((d) => setSubs(d.subscribers || [])); }, []);
  useEffect(() => { load(); }, [load]);
  async function remove(id: string) { if (!confirm("Remove this subscriber?")) return; await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" }); load(); }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div><p className="mono-label text-accent-deep mb-2">Newsletter</p><h1 className="display text-4xl text-ink">Subscribers</h1></div>
        <a href="/api/admin/subscribers?format=csv" className="bg-surface border border-line rounded-full px-5 py-2.5 text-sm hover:border-brand hover:text-brand transition-colors">Export CSV ↓</a>
      </div>
      <div className="bg-surface border border-line rounded-2xl overflow-hidden">
        {subs.length === 0 && <p className="p-8 text-center text-graphite">No subscribers yet.</p>}
        {subs.map((s) => (
          <div key={s.id} className="border-b border-line last:border-0 px-5 py-4 flex items-center justify-between gap-3">
            <div><p className="text-ink">{s.email}</p><p className="text-xs text-graphite">{new Date(s.created_at).toLocaleDateString()} · {s.status}</p></div>
            <button onClick={() => remove(s.id)} className="text-xs text-accent-deep hover:underline">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
