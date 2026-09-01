"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PRACTICES } from "@/lib/data";
import { EMPLOYMENT_TYPES, WORKPLACES, JOB_STATUSES } from "@/lib/jobs";

type Job = {
  id: string;
  title: string;
  slug: string;
  practice: string | null;
  location: string | null;
  employment_type: string;
  workplace: string;
  experience: string | null;
  salary_range: string | null;
  summary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  status: string;
  post_linkedin: boolean;
  post_naukri: boolean;
  linkedin_posted_at: string | null;
  naukri_posted_at: string | null;
  sort_order: number;
  application_count: number;
};

const emptyForm = {
  title: "", practice: "", location: "", employment_type: "Full-time", workplace: "On-site",
  experience: "", salary_range: "", summary: "", description: "", responsibilities: "",
  requirements: "", benefits: "", status: "draft", sort_order: "0",
  post_linkedin: false, post_naukri: false,
};

const field =
  "w-full bg-surface border border-line rounded-xl px-4 py-3 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

export default function JobsAdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  // Distinguishes "not fetched yet" from "fetched and genuinely empty".
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/jobs").then((r) => r.json()).then((d) => setJobs(d.jobs || [])).catch(() => {}).finally(() => setLoaded(true));
  }, []);
  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const payload = { ...form, sort_order: parseInt(form.sort_order, 10) || 0 };
      const url = editingId ? `/api/admin/jobs/${editingId}` : "/api/admin/jobs";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save the job.");
      setForm(emptyForm); setEditingId(null); load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save the job.");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(j: Job) {
    setEditingId(j.id);
    setForm({
      title: j.title, practice: j.practice || "", location: j.location || "",
      employment_type: j.employment_type, workplace: j.workplace, experience: j.experience || "",
      salary_range: j.salary_range || "", summary: j.summary, description: j.description,
      responsibilities: j.responsibilities, requirements: j.requirements, benefits: j.benefits,
      status: j.status, sort_order: String(j.sort_order),
      post_linkedin: j.post_linkedin, post_naukri: j.post_naukri,
    });
    setErr(""); setNote("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() { setEditingId(null); setForm(emptyForm); setErr(""); }

  async function remove(id: string) {
    if (!confirm("Delete this job? Applications stay but lose their link.")) return;
    const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  async function distribute(job: Job, channel: "linkedin" | "naukri", mark: boolean) {
    setNote("");
    const res = await fetch(`/api/admin/jobs/${job.id}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, mark }),
    });
    const data = await res.json();
    if (!res.ok) { setNote(data.error || "Failed."); return; }

    if (channel === "linkedin") {
      window.open(data.shareUrl, "_blank", "noopener");
      try { await navigator.clipboard.writeText(data.postText); } catch {}
      setNote("LinkedIn share window opened — the post text is on your clipboard to paste in.");
    } else {
      try {
        await navigator.clipboard.writeText(data.postText);
        setNote("Job post copied — paste it into your Naukri recruiter dashboard.");
      } catch {
        setNote("Could not copy automatically. Open the job's post text manually.");
      }
      window.open(data.shareUrl, "_blank", "noopener");
    }
    if (mark) load();
  }

  return (
    <div>
      <p className="mono-label text-accent-deep mb-2">Jobs</p>
      <h1 className="display text-4xl text-ink">Job vacancies</h1>
      <p className="mt-3 text-graphite max-w-2xl">
        Publish roles to the careers page, write the full JD, and push each one to LinkedIn or Naukri.
        Candidate applications land in <Link href="/admin/applications" className="text-brand hover:underline">Applications</Link>.
      </p>

      <form onSubmit={submit} className="mt-8 bg-surface border border-line rounded-2xl p-6 space-y-4 max-w-3xl">
        <h2 className="display text-xl text-ink">{editingId ? "Edit role" : "New role"}</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="mono-label text-graphite block mb-2">Job title</label>
            <input className={field} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Senior Salesforce Developer" />
          </div>

          <div>
            <label className="mono-label text-graphite block mb-2">Practice</label>
            <select className={field} value={form.practice} onChange={(e) => set("practice", e.target.value)}>
              <option value="">—</option>
              {PRACTICES.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              <option value="Delivery">Delivery</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="mono-label text-graphite block mb-2">Location</label>
            <input className={field} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Frisco, TX" />
          </div>

          <div>
            <label className="mono-label text-graphite block mb-2">Employment type</label>
            <select className={field} value={form.employment_type} onChange={(e) => set("employment_type", e.target.value)}>
              {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mono-label text-graphite block mb-2">Workplace</label>
            <select className={field} value={form.workplace} onChange={(e) => set("workplace", e.target.value)}>
              {WORKPLACES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="mono-label text-graphite block mb-2">Experience</label>
            <input className={field} value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="5+ years" />
          </div>
          <div>
            <label className="mono-label text-graphite block mb-2">Salary range <span className="text-graphite/50">(optional)</span></label>
            <input className={field} value={form.salary_range} onChange={(e) => set("salary_range", e.target.value)} placeholder="$120k–$150k" />
          </div>

          <div className="sm:col-span-2">
            <label className="mono-label text-graphite block mb-2">Summary <span className="text-graphite/50">— one or two lines for the card</span></label>
            <textarea className={`${field} min-h-[64px] resize-y`} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="mono-label text-graphite block mb-2">Description <span className="text-graphite/50">— the JD intro</span></label>
            <textarea className={`${field} min-h-[120px] resize-y`} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="mono-label text-graphite block mb-2">Responsibilities <span className="text-graphite/50">— one per line</span></label>
            <textarea className={`${field} min-h-[100px] resize-y`} value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="mono-label text-graphite block mb-2">Requirements <span className="text-graphite/50">— one per line</span></label>
            <textarea className={`${field} min-h-[100px] resize-y`} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="mono-label text-graphite block mb-2">What we offer <span className="text-graphite/50">— one per line</span></label>
            <textarea className={`${field} min-h-[80px] resize-y`} value={form.benefits} onChange={(e) => set("benefits", e.target.value)} />
          </div>

          <div>
            <label className="mono-label text-graphite block mb-2">Status</label>
            <select className={field} value={form.status} onChange={(e) => set("status", e.target.value)}>
              {JOB_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="mono-label text-graphite block mb-2">Sort order</label>
            <input type="number" className={field} value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
          </div>

          <div className="sm:col-span-2 flex flex-wrap gap-6 py-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.post_linkedin} onChange={(e) => set("post_linkedin", e.target.checked)} className="w-4 h-4 accent-brand" />
              <span className="mono-label text-ink">Distribute to LinkedIn</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.post_naukri} onChange={(e) => set("post_naukri", e.target.checked)} className="w-4 h-4 accent-brand" />
              <span className="mono-label text-ink">Distribute to Naukri</span>
            </label>
          </div>
        </div>

        {err && <p className="text-sm text-accent-deep">{err}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={busy} className="bg-brand text-white px-6 py-3 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
            {busy ? "Saving…" : editingId ? "Save changes" : "Create role"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="border border-line text-graphite px-6 py-3 rounded-full font-medium hover:border-ink hover:text-ink transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>

      {note && <p className="mt-4 text-sm text-brand max-w-3xl">{note}</p>}

      <h2 className="display text-2xl text-ink mt-12 mb-6">All roles</h2>
      <div className="space-y-4 max-w-4xl">
        {!loaded ? (
          <div className="bg-surface border border-line rounded-2xl p-8 text-center text-graphite">Loading…</div>
        ) : jobs.length === 0 ? (
          <div className="bg-surface border border-line rounded-2xl p-8 text-center text-graphite">
            No jobs yet. Create one above.
          </div>
        ) : null}
        {jobs.map((j) => (
          <div key={j.id} className="bg-surface border border-line rounded-2xl p-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-ink">{j.title}</h3>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                    j.status === "published" ? "bg-brand/10 text-brand"
                      : j.status === "closed" ? "bg-graphite/10 text-graphite"
                      : "bg-accent/10 text-accent-deep"
                  }`}>{j.status}</span>
                  <span className="text-xs bg-paper border border-line text-graphite px-2 py-0.5 rounded-full">Order: {j.sort_order}</span>
                </div>
                <p className="text-xs text-graphite mt-1">
                  {[j.practice, j.location, j.workplace, j.employment_type].filter(Boolean).join(" · ")}
                </p>
                <p className="text-xs text-graphite mt-1 line-clamp-2 max-w-xl">{j.summary || "—"}</p>
                <div className="flex gap-3 mt-2 text-[11px] text-graphite">
                  <Link href={`/admin/applications?job_id=${j.id}`} className="text-brand hover:underline">
                    {j.application_count} application{j.application_count === 1 ? "" : "s"}
                  </Link>
                  {j.status === "published" && (
                    <a href={`/careers/${j.slug}`} target="_blank" className="hover:text-brand">View public page ↗</a>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(j)} className="text-xs bg-surface border border-line text-ink px-3 py-1.5 rounded-full hover:border-graphite transition-colors">Edit</button>
                <button onClick={() => remove(j.id)} className="text-xs text-accent-deep hover:underline px-3 py-1.5">Delete</button>
              </div>
            </div>

            {(j.post_linkedin || j.post_naukri) && (
              <div className="mt-4 pt-4 border-t border-line/60 flex flex-wrap items-center gap-2">
                <span className="mono-label text-graphite mr-1">Distribute:</span>
                {j.post_linkedin && (
                  <>
                    <button onClick={() => distribute(j, "linkedin", false)} className="text-xs bg-[#0A66C2] text-white px-3 py-1.5 rounded-full hover:opacity-90">Share to LinkedIn</button>
                    <button onClick={() => distribute(j, "linkedin", true)} className="text-xs border border-line text-ink px-3 py-1.5 rounded-full hover:border-graphite">
                      {j.linkedin_posted_at ? `LinkedIn ✓ ${new Date(j.linkedin_posted_at).toLocaleDateString()}` : "Mark posted"}
                    </button>
                  </>
                )}
                {j.post_naukri && (
                  <>
                    <button onClick={() => distribute(j, "naukri", false)} className="text-xs bg-[#4A90E2] text-white px-3 py-1.5 rounded-full hover:opacity-90">Copy for Naukri</button>
                    <button onClick={() => distribute(j, "naukri", true)} className="text-xs border border-line text-ink px-3 py-1.5 rounded-full hover:border-graphite">
                      {j.naukri_posted_at ? `Naukri ✓ ${new Date(j.naukri_posted_at).toLocaleDateString()}` : "Mark posted"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
