"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMsg("Enter a valid email.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setEmail("");
    } catch {
      setState("error");
      setMsg("Could not subscribe. Try again.");
    }
  }

  if (state === "done") {
    return <p className="text-sm text-accent">Thanks — you&apos;re on the list.</p>;
  }

  return (
    <form onSubmit={submit}>
      <label className="mono-label text-graphite block mb-2">Newsletter</label>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setState("idle"); }}
          placeholder="you@company.com"
          className="flex-1 bg-surface border border-line rounded-full px-4 py-2.5 text-sm text-ink placeholder:text-graphite/60 focus:border-brand focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="bg-brand text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-deep transition-colors disabled:opacity-50"
        >
          {state === "loading" ? "…" : "Join"}
        </button>
      </div>
      {state === "error" && <p className="text-xs text-brand mt-2">{msg}</p>}
    </form>
  );
}
