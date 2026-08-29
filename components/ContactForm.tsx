"use client";

import { useState } from "react";
import { PRACTICES } from "@/lib/data";

export default function ContactForm({ source = "contact" }: { source?: "contact" | "enquiry" }) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", practice: "", message: "", website: "" });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.name.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email) && form.message.trim().length > 4;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setStatus("loading");
    setErr("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });
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
      <div className="bg-paper border border-line rounded-3xl p-10 sm:p-14 h-full grid place-items-center text-center">
        <div>
          <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-brand text-white text-2xl mb-6">✓</div>
          <h3 className="display text-3xl text-ink">Message received.</h3>
          <p className="mt-3 text-graphite max-w-sm">Thanks, {form.name.split(" ")[0]}. A practice lead will be in touch shortly.</p>
          <button onClick={() => { setStatus("idle"); setForm({ name: "", email: "", company: "", phone: "", practice: "", message: "", website: "" }); }} className="mt-8 mono-label text-brand hover:underline">
            Send another →
          </button>
        </div>
      </div>
    );
  }

  const field = "w-full bg-surface border border-line rounded-xl px-4 py-3.5 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

  return (
    <form onSubmit={submit} className="bg-paper border border-line rounded-3xl p-7 sm:p-10 space-y-5">
      {/* honeypot */}
      <input type="text" name="website" value={form.website} onChange={(e) => set("website", e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="mono-label text-graphite block mb-2">Name</label>
          <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" />
        </div>
        <div>
          <label className="mono-label text-graphite block mb-2">Work email</label>
          <input className={field} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@company.com" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="mono-label text-graphite block mb-2">Company</label>
          <input className={field} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company Inc." />
        </div>
        <div>
          <label className="mono-label text-graphite block mb-2">Phone <span className="text-graphite/50">(optional)</span></label>
          <input className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 000 0000" />
        </div>
      </div>
      <div>
        <label className="mono-label text-graphite block mb-2">Practice</label>
        <select className={field} value={form.practice} onChange={(e) => set("practice", e.target.value)}>
          <option value="">Select one</option>
          {PRACTICES.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
          <option value="Other">Not sure yet</option>
        </select>
      </div>
      <div>
        <label className="mono-label text-graphite block mb-2">{source === "enquiry" ? "Your enquiry" : "What are you modernizing?"}</label>
        <textarea className={`${field} min-h-[140px] resize-y`} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="A few lines on your project, systems, and timeline." />
      </div>
      {status === "error" && <p className="text-sm text-accent-deep">{err}</p>}
      <button type="submit" disabled={!valid || status === "loading"} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand text-white px-8 py-3.5 rounded-full font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-deep transition-colors">
        {status === "loading" ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
