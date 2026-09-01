"use client";

import { useCallback, useEffect, useState } from "react";
import { APPLICATION_STATUSES } from "@/lib/jobs";

type Application = {
  id: string;
  job_id: string | null;
  job_title: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  cover_note: string | null;
  cv_filename: string;
  cv_size: number;
  status: string;
  created_at: string;
};

const STATUS_STYLE: Record<string, string> = {
  new: "bg-brand/10 text-brand",
  reviewing: "bg-accent/10 text-accent-deep",
  shortlisted: "bg-green-100 text-green-700",
  rejected: "bg-graphite/10 text-graphite",
  archived: "bg-graphite/10 text-graphite",
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  // Distinguishes "not fetched yet" from "fetched and genuinely empty".
  const [loaded, setLoaded] = useState(false);
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([]);
  const [jobId, setJobId] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("job_id");
    if (p) setJobId(p);
  }, []);

  const load = useCallback(() => {
    const qs = new URLSearchParams();
    if (jobId !== "all") qs.set("job_id", jobId);
    if (status !== "all") qs.set("status", status);
    fetch(`/api/admin/applications?${qs}`)
      .then((r) => r.json())
      .then((d) => { setApps(d.applications || []); setJobs(d.jobs || []); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [jobId, status]);
  useEffect(() => { load(); }, [load]);

  async function setAppStatus(id: string, s: string) {
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s }),
    });
    if (res.ok) load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this application and its CV permanently?")) return;
    const res = await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  const csvUrl = () => {
    const qs = new URLSearchParams({ format: "csv" });
    if (jobId !== "all") qs.set("job_id", jobId);
    if (status !== "all") qs.set("status", status);
    return `/api/admin/applications?${qs}`;
  };

  const chip = "mono-label px-3 py-1.5 rounded-full border transition-colors cursor-pointer";

  return (
    <div>
      <p className="mono-label text-accent-deep mb-2">Applications</p>
      <h1 className="display text-4xl text-ink">Candidate hub</h1>
      <p className="mt-3 text-graphite">Every Apply Now submission from the careers site, with CV attached.</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="bg-surface border border-line rounded-full px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none">
          <option value="all">All roles</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <div className="flex flex-wrap gap-2">
          {["all", ...APPLICATION_STATUSES].map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={`${chip} ${status === s ? "bg-brand text-white border-brand" : "text-graphite border-line-blue hover:border-brand hover:text-brand"}`}>
              {s}
            </button>
          ))}
        </div>
        <a href={csvUrl()} className="ml-auto text-sm text-brand hover:underline">Export CSV ↓</a>
      </div>

      <div className="mt-6 space-y-3 max-w-4xl">
        {!loaded ? (
          <div className="bg-surface border border-line rounded-2xl p-8 text-center text-graphite">Loading…</div>
        ) : apps.length === 0 ? (
          <div className="bg-surface border border-line rounded-2xl p-8 text-center text-graphite">No applications match this filter.</div>
        ) : null}
        {apps.map((a) => (
          <div key={a.id} className="bg-surface border border-line rounded-2xl p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-ink">{a.name}</h3>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLE[a.status] || "bg-graphite/10 text-graphite"}`}>{a.status}</span>
                </div>
                <p className="text-xs text-graphite mt-1">
                  {a.job_title || "General"} · <a href={`mailto:${a.email}`} className="hover:text-brand">{a.email}</a>
                  {a.phone ? ` · ${a.phone}` : ""}{a.location ? ` · ${a.location}` : ""}
                </p>
                <p className="text-[11px] text-graphite mt-1">{new Date(a.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={`/api/admin/applications/${a.id}/cv`} className="text-xs bg-brand text-white px-3 py-1.5 rounded-full hover:bg-brand-deep">Download CV</a>
                <select value={a.status} onChange={(e) => setAppStatus(a.id, e.target.value)} className="text-xs bg-surface border border-line rounded-full px-3 py-1.5 text-ink focus:border-brand focus:outline-none">
                  {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => setOpen(open === a.id ? null : a.id)} className="text-xs border border-line text-ink px-3 py-1.5 rounded-full hover:border-graphite">
                  {open === a.id ? "Hide" : "Details"}
                </button>
                <button onClick={() => remove(a.id)} className="text-xs text-accent-deep hover:underline px-2">Delete</button>
              </div>
            </div>
            {open === a.id && (
              <div className="mt-4 pt-4 border-t border-line/60 text-sm text-graphite space-y-2">
                {a.linkedin_url && <p>LinkedIn: <a href={a.linkedin_url} target="_blank" className="text-brand hover:underline">{a.linkedin_url}</a></p>}
                <p>CV file: <strong>{a.cv_filename}</strong> ({Math.round(a.cv_size / 1024)} KB)</p>
                {a.cover_note && <p className="whitespace-pre-wrap"><span className="text-ink font-medium">Note:</span> {a.cover_note}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
