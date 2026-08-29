"use client";

import { useState } from "react";
import { CV_MAX_BYTES } from "@/lib/jobs";

export default function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", location: "", linkedin_url: "", cover_note: "", website: "",
  });
  const [cv, setCv] = useState<File | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid =
    form.name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    !!cv &&
    cv.size <= CV_MAX_BYTES;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!cv) { setErr("Please attach your CV (PDF or Word)."); return; }
    if (cv.size > CV_MAX_BYTES) { setErr("Your CV is over the 10MB limit."); return; }
    if (!valid) return;

    setStatus("loading");
    const fd = new FormData();
    fd.set("job_id", jobId);
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    fd.set("cv", cv);

    try {
      const res = await fetch("/api/applications", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
    } catch (e) {
      setStatus("error");
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-paper border border-line rounded-3xl p-10 sm:p-14 text-center">
        <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-brand text-white text-2xl mb-6">✓</div>
        <h3 className="display text-3xl text-ink">Application received.</h3>
        <p className="mt-3 text-graphite max-w-sm mx-auto">
          Thanks, {form.name.split(" ")[0]}. Our talent team will review your CV for {jobTitle} and be in touch.
        </p>
      </div>
    );
  }

  const field =
    "w-full bg-surface border border-line rounded-xl px-4 py-3.5 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

  return (
    <form onSubmit={submit} className="bg-paper border border-line rounded-3xl p-7 sm:p-10 space-y-5">
      <input type="text" name="website" value={form.website} onChange={(e) => set("website", e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="mono-label text-graphite block mb-2">Full name</label>
          <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" />
        </div>
        <div>
          <label className="mono-label text-graphite block mb-2">Email</label>
          <input className={field} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@email.com" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="mono-label text-graphite block mb-2">Phone <span className="text-graphite/50">(optional)</span></label>
          <input className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 000 0000" />
        </div>
        <div>
          <label className="mono-label text-graphite block mb-2">Location <span className="text-graphite/50">(optional)</span></label>
          <input className={field} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Austin, TX" />
        </div>
      </div>
      <div>
        <label className="mono-label text-graphite block mb-2">LinkedIn URL <span className="text-graphite/50">(optional)</span></label>
        <input className={field} value={form.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/…" />
      </div>
      <div>
        <label className="mono-label text-graphite block mb-2">CV / Résumé <span className="text-graphite/50">— PDF or Word, max 10MB</span></label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setCv(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-graphite file:mr-4 file:rounded-full file:border-0 file:bg-brand file:px-5 file:py-2.5 file:text-white file:font-medium hover:file:bg-brand-deep file:cursor-pointer"
        />
        {cv && <p className="mt-2 text-xs text-graphite">{cv.name} · {Math.round(cv.size / 1024)} KB</p>}
      </div>
      <div>
        <label className="mono-label text-graphite block mb-2">Cover note <span className="text-graphite/50">(optional)</span></label>
        <textarea className={`${field} min-h-[120px] resize-y`} value={form.cover_note} onChange={(e) => set("cover_note", e.target.value)} placeholder="A few lines on why this role fits." />
      </div>

      {status === "error" && <p className="text-sm text-accent-deep">{err}</p>}

      <button type="submit" disabled={!valid || status === "loading"} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand text-white px-8 py-3.5 rounded-full font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-deep transition-colors">
        {status === "loading" ? "Submitting…" : "Submit application →"}
      </button>
    </form>
  );
}
