"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/admin/AuthShell";

export default function SetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [state, setState] = useState<"checking" | "ready" | "invalid" | "done">("checking");
  const [who, setWho] = useState<{ email: string; name: string }>({ email: "", name: "" });
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    fetch(`/api/auth/check-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.valid) { setWho({ email: d.email, name: d.name }); setState("ready"); }
        else setState("invalid");
      })
      .catch(() => setState("invalid"));
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (pw.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (pw !== pw2) { setErr("Passwords don't match."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: pw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not set password.");
      setState("done");
      setTimeout(() => { router.push("/admin/login"); router.refresh(); }, 1500);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not set password.");
    } finally {
      setBusy(false);
    }
  }

  const field = "w-full bg-surface border border-line rounded-xl px-4 py-3.5 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

  if (state === "checking") return <AuthShell title="One moment…"><p className="text-sm text-graphite">Checking your link…</p></AuthShell>;

  if (state === "invalid") {
    return (
      <AuthShell title="Link expired" footer={<Link href="/admin/forgot-password" className="text-brand hover:underline">Request a new link</Link>}>
        <p className="text-sm text-graphite">This link is invalid or has already been used.</p>
      </AuthShell>
    );
  }

  if (state === "done") {
    return <AuthShell title="Password set ✓"><p className="text-sm text-graphite">Taking you to sign in…</p></AuthShell>;
  }

  return (
    <AuthShell title="Set your password" subtitle={who.email ? `for ${who.email}` : undefined}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mono-label text-graphite block mb-2">New password</label>
          <input className={field} type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 8 characters" autoFocus />
        </div>
        <div>
          <label className="mono-label text-graphite block mb-2">Confirm password</label>
          <input className={field} type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Repeat it" />
        </div>
        {err && <p className="text-sm text-accent-deep">{err}</p>}
        <button type="submit" disabled={busy} className="w-full bg-brand text-white py-3.5 rounded-xl font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
          {busy ? "Saving…" : "Set password & continue"}
        </button>
      </form>
    </AuthShell>
  );
}
