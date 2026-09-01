"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Template = {
  slug: string; name: string; subject: string; html: string;
  vars: Record<string, string>; customised: boolean; updated_at: string | null;
};
type Newsletter = { id: string; subject: string; sent_count: number; status: string; created_at: string };

const input = "w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";
const TABS = ["Compose & send", "Templates", "History"] as const;

/* ---------------- AI assistant ---------------- */
function AiAssist({ context, format, threadId, onDraft }: {
  context: string; format: "html" | "text"; threadId: string;
  onDraft: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [left, setLeft] = useState<number | null>(null);

  async function run() {
    setBusy(true); setMsg("");
    try {
      const res = await fetch("/api/admin/ai/draft", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context, format, threadId }),
      });
      const d = await res.json();
      if (!res.ok) { setMsg(d.error || "Failed."); return; }
      setLeft(d.draftsLeft);
      if (d.isRefusal) { setMsg(d.draft); return; }
      onDraft(d.draft);
      setMsg(`Draft inserted. ${d.draftsLeft} AI draft${d.draftsLeft === 1 ? "" : "s"} left for this email.`);
      setPrompt("");
    } finally { setBusy(false); }
  }

  return (
    <div className="border border-line-blue rounded-xl bg-paper-tint/40 p-3">
      <button type="button" onClick={() => setOpen(!open)} className="mono-label text-accent-deep">
        ✨ Draft with AI {open ? "▾" : "▸"}
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          <textarea className={`${input} min-h-[64px]`} value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Write a warm 3-paragraph newsletter announcing our new Workday practice" />
          <div className="flex items-center gap-3">
            <button type="button" onClick={run} disabled={busy || prompt.trim().length < 3}
              className="text-xs bg-brand text-white px-4 py-2 rounded-full hover:bg-brand-deep disabled:opacity-50">
              {busy ? "Thinking…" : "Generate"}
            </button>
            {left !== null && <span className="text-[11px] text-graphite">{left} left</span>}
          </div>
          {msg && <p className="text-xs text-graphite">{msg}</p>}
          <p className="text-[11px] text-graphite/70">The assistant only drafts Noblesoft emails, max 5 drafts per email.</p>
        </div>
      )}
    </div>
  );
}

/* ---------------- starter layouts ---------------- */
const STARTERS: { name: string; subject: string; html: string }[] = [
  {
    name: "Company update",
    subject: "A quick update from Noblesoft",
    html: `<h2 style="font-family:Inter,Arial,sans-serif;color:#17222E">Hello,</h2>
<p style="font-family:Inter,Arial,sans-serif;color:#17222E;line-height:1.6">We wanted to share a few things happening at Noblesoft this quarter.</p>
<ul style="font-family:Inter,Arial,sans-serif;color:#17222E;line-height:1.6">
  <li><strong>New practice:</strong> …</li>
  <li><strong>Client win:</strong> …</li>
  <li><strong>Team:</strong> …</li>
</ul>
<p style="font-family:Inter,Arial,sans-serif;color:#17222E;line-height:1.6">More soon — thanks for reading.</p>`,
  },
  {
    name: "Event / webinar invite",
    subject: "You're invited: Noblesoft webinar",
    html: `<h2 style="font-family:Inter,Arial,sans-serif;color:#17222E">You're invited</h2>
<p style="font-family:Inter,Arial,sans-serif;color:#17222E;line-height:1.6">Join us for a live session on <strong>[topic]</strong>.</p>
<p style="font-family:Inter,Arial,sans-serif;color:#17222E;line-height:1.6"><strong>When:</strong> [date, time]<br/><strong>Where:</strong> [link]</p>
<p><a href="[register-url]" style="display:inline-block;background:#E4641E;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600">Register</a></p>`,
  },
  {
    name: "New role announcement",
    subject: "We're hiring — [role]",
    html: `<h2 style="font-family:Inter,Arial,sans-serif;color:#17222E">We're growing the team</h2>
<p style="font-family:Inter,Arial,sans-serif;color:#17222E;line-height:1.6">We're looking for a <strong>[role]</strong> to join our [practice] practice.</p>
<p style="font-family:Inter,Arial,sans-serif;color:#17222E;line-height:1.6">Know someone great? Share this link:</p>
<p><a href="[job-url]" style="color:#1B7FB5">[job-url]</a></p>`,
  },
];

/* ---------------- Compose ---------------- */
function Compose() {
  const [subject, setSubject] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [to, setTo] = useState<"subscribers" | "employees" | "custom">("subscribers");
  const [custom, setCustom] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [audience, setAudience] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<{ filename: string; contentType: string; dataBase64: string; size: number }[]>([]);
  const [result, setResult] = useState<{ ok: boolean; sent: number; note?: string; error?: string } | null>(null);
  const threadId = useMemo(() => `compose-${Date.now()}`, []);

  async function addFiles(list: FileList | null) {
    if (!list) return;
    for (const f of Array.from(list)) {
      const buf = await f.arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      setFiles((prev) => [...prev, { filename: f.name, contentType: f.type || "application/octet-stream", dataBase64: b64, size: f.size }]);
    }
  }

  useEffect(() => {
    fetch("/api/admin/newsletter").then((r) => r.json()).then((d) => setAudience(d.activeSubscribers ?? null));
  }, []);

  const split = (s: string) => s.split(/[,\s]+/).map((x) => x.trim()).filter(Boolean);

  async function send() {
    setBusy(true); setResult(null);
    const payload = {
      subject, contentHtml, to,
      recipients: to === "custom" ? split(custom) : undefined,
      cc: split(cc), bcc: split(bcc),
      attachments: files.map(({ filename, contentType, dataBase64 }) => ({ filename, contentType, dataBase64 })),
    };
    const res = await fetch("/api/admin/newsletter", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    setResult(await res.json());
    setBusy(false);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 max-w-5xl">
      <div className="space-y-4">
        <div>
          <label className="mono-label text-graphite block mb-1.5">Audience</label>
          <select className={input} value={to} onChange={(e) => setTo(e.target.value as typeof to)}>
            <option value="subscribers">Newsletter subscribers{audience !== null ? ` (${audience})` : ""}</option>
            <option value="employees">All active employees</option>
            <option value="custom">Custom list</option>
          </select>
        </div>
        {to === "custom" && (
          <input className={input} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="a@x.com, b@y.com" />
        )}
        <div className="grid grid-cols-2 gap-3">
          <input className={input} value={cc} onChange={(e) => setCc(e.target.value)} placeholder="CC (optional)" />
          <input className={input} value={bcc} onChange={(e) => setBcc(e.target.value)} placeholder="BCC (optional)" />
        </div>
        <input className={input} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />

        <div>
          <label className="mono-label text-graphite block mb-1.5">Start from a layout</label>
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button type="button" key={s.name}
                onClick={() => { if (!contentHtml || confirm("Replace the current body?")) { setSubject(s.subject); setContentHtml(s.html); } }}
                className="text-xs border border-line text-graphite px-3 py-1.5 rounded-full hover:border-brand hover:text-brand">
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <AiAssist context={contentHtml} format="html" threadId={threadId} onDraft={setContentHtml} />
        <textarea className={`${input} min-h-[280px] font-mono text-xs`} value={contentHtml}
          onChange={(e) => setContentHtml(e.target.value)} placeholder="Email body — HTML allowed. Wrapped in the Noblesoft template on send." />

        <div>
          <label className="mono-label text-graphite block mb-1.5">Attachments</label>
          <input type="file" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
            className="block w-full text-sm text-graphite file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white file:text-xs file:cursor-pointer" />
          {files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {files.map((f, i) => (
                <li key={i} className="text-xs text-graphite flex items-center gap-2">
                  {f.filename} · {Math.round(f.size / 1024)} KB
                  <button type="button" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="text-accent-deep hover:underline">remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={send} disabled={busy || !subject || contentHtml.length < 10}
          className="bg-brand text-white px-6 py-3 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
          {busy ? "Sending…" : "Send email"}
        </button>
        {result && (
          <p className={`text-sm ${result.ok ? "text-brand" : "text-accent-deep"}`}>
            {result.ok ? `Sent to ${result.sent} recipient${result.sent === 1 ? "" : "s"}.` : (result.error || "Failed.")}
            {result.note ? ` — ${result.note}` : ""}
          </p>
        )}
      </div>
      <div className="lg:sticky lg:top-24 self-start">
        <p className="mono-label text-graphite mb-2">Preview</p>
        <div className="border border-line rounded-2xl bg-surface p-3 max-h-[520px] overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: contentHtml || "<p style='color:#999'>Nothing yet…</p>" }} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Templates ---------------- */
function Templates() {
  const [items, setItems] = useState<Template[]>([]);
  const [sel, setSel] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [msg, setMsg] = useState("");
  const threadId = useMemo(() => `tpl-${Date.now()}`, []);

  const load = useCallback(() => {
    fetch("/api/admin/email-templates").then((r) => r.json()).then((d) => {
      setItems(d.templates || []);
      if (!sel && d.templates?.[0]) pick(d.templates[0]);
    });
  }, [sel]);
  useEffect(() => { load(); }, [load]);

  function pick(t: Template) { setSel(t.slug); setSubject(t.subject); setHtml(t.html); setMsg(""); }
  const current = items.find((t) => t.slug === sel);

  async function save() {
    const res = await fetch(`/api/admin/email-templates/${sel}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, html }),
    });
    const d = await res.json();
    setMsg(res.ok ? "Saved ✓" : d.error || "Failed");
    if (res.ok) load();
  }
  async function reset() {
    if (!confirm("Restore the built-in default for this template?")) return;
    await fetch(`/api/admin/email-templates/${sel}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 max-w-5xl">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {items.map((t) => (
            <button key={t.slug} onClick={() => pick(t)}
              className={`mono-label px-3 py-1.5 rounded-full border ${sel === t.slug ? "bg-brand text-white border-brand" : "border-line text-graphite hover:border-brand"}`}>
              {t.name}{t.customised ? " •" : ""}
            </button>
          ))}
        </div>
        {current && (
          <>
            <input className={input} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
            <AiAssist context={html} format="html" threadId={threadId} onDraft={setHtml} />
            <textarea className={`${input} min-h-[320px] font-mono text-xs`} value={html} onChange={(e) => setHtml(e.target.value)} />
            <p className="text-[11px] text-graphite/70">
              Placeholders: {Object.entries(current.vars).map(([k, v]) => `{{${k}}} — ${v}`).join(" · ")}
            </p>
            <div className="flex items-center gap-3">
              <button onClick={save} className="bg-brand text-white px-5 py-2.5 rounded-full font-medium hover:bg-brand-deep">Save template</button>
              {current.customised && <button onClick={reset} className="text-sm text-accent-deep hover:underline">Reset to default</button>}
              {msg && <span className="text-sm text-brand">{msg}</span>}
            </div>
          </>
        )}
      </div>
      <div className="lg:sticky lg:top-24 self-start">
        <p className="mono-label text-graphite mb-2">Preview</p>
        <div className="border border-line rounded-2xl bg-surface p-3 max-h-[520px] overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- History ---------------- */
function History() {
  const [rows, setRows] = useState<Newsletter[]>([]);
  // Distinguishes "not fetched yet" from "fetched and genuinely empty".
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { fetch("/api/admin/newsletter").then((r) => r.json()).then((d) => setRows(d.newsletters || [])).catch(() => {}).finally(() => setLoaded(true)); }, []);
  return (
    <div className="max-w-3xl bg-surface border border-line rounded-2xl overflow-hidden">
      {!loaded ? <p className="p-8 text-center text-graphite">Loading…</p> : rows.length === 0 ? <p className="p-8 text-center text-graphite">No emails sent yet.</p> : null}
      {rows.map((r) => (
        <div key={r.id} className="border-b border-line last:border-0 px-5 py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-ink font-medium truncate">{r.subject}</p>
            <p className="text-xs text-graphite">{new Date(r.created_at).toLocaleString()}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm text-ink">{r.sent_count} sent</p>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${r.status === "sent" ? "bg-brand/10 text-brand" : "bg-graphite/10 text-graphite"}`}>{r.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EmailPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Compose & send");
  return (
    <div>
      <p className="mono-label text-accent-deep mb-2">Email & campaigns</p>
      <h1 className="display text-4xl text-ink">Email</h1>
      <p className="mt-2 text-graphite text-sm">Send newsletters and updates, edit the transactional templates, and track what went out.</p>
      <div className="flex flex-wrap gap-2 my-8">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`mono-label px-4 py-2 rounded-full border transition-colors ${tab === t ? "bg-brand text-white border-brand" : "text-graphite border-line-blue hover:border-brand hover:text-brand"}`}>
            {t}
          </button>
        ))}
      </div>
      {tab === "Compose & send" && <Compose />}
      {tab === "Templates" && <Templates />}
      {tab === "History" && <History />}
    </div>
  );
}
