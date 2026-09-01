"use client";

import Link from "next/link";
import { useState } from "react";
import AuthShell from "@/components/admin/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const field = "w-full bg-surface border border-line rounded-xl px-4 py-3.5 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

  return (
    <AuthShell
      title="Reset password"
      subtitle={done ? undefined : "Enter your admin email and we'll send a reset link."}
      footer={<Link href="/admin/login" className="text-brand hover:underline">Back to sign in</Link>}
    >
      {done ? (
        <p className="text-sm text-graphite">
          If <strong>{email}</strong> has an account, a reset link is on its way. The link expires in 1 hour.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mono-label text-graphite block mb-2">Email</label>
            <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@testsoft.com" autoFocus />
          </div>
          {err && <p className="text-sm text-accent-deep">{err}</p>}
          <button type="submit" disabled={busy} className="w-full bg-brand text-white py-3.5 rounded-xl font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
