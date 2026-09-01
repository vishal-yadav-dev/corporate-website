"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push(params.get("next") || "/admin");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed.");
      setLoading(false);
    }
  }

  const field = "w-full bg-surface border border-line rounded-xl px-4 py-3.5 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

  return (
    <div className="min-h-screen grid place-items-center bg-paper px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="h-9 w-9 grid place-items-center bg-brand text-white font-display font-bold text-lg rounded-[6px]">N</span>
          <span className="display text-2xl text-ink">Testsoft</span>
        </div>
        <div className="bg-surface border border-line rounded-3xl p-8 shadow-xl shadow-brand/5">
          <h1 className="display text-2xl text-ink mb-1">Admin sign in</h1>
          <p className="text-sm text-graphite mb-6">Access the Testsoft control panel.</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mono-label text-graphite block mb-2">Email</label>
              <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@testsoft.com" autoFocus />
            </div>
            <div>
              <label className="mono-label text-graphite block mb-2">Password</label>
              <input className={field} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {err && <p className="text-sm text-accent-deep">{err}</p>}
            <button type="submit" disabled={loading} className="w-full bg-brand text-white py-3.5 rounded-xl font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            <Link href="/admin/forgot-password" className="text-brand hover:underline">Forgot your password?</Link>
          </p>
        </div>
        <p className="text-center text-xs text-graphite mt-6">Testsoft Technologies · Internal use only</p>
      </div>
    </div>
  );
}
