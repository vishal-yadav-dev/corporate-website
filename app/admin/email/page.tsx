"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import EmailChips, { isEmail } from "@/components/admin/EmailChips";
import RichEmailEditor from "@/components/admin/RichEmailEditor";
import { joinFrame, splitFrame } from "@/lib/email-shell";

type Template = {
  slug: string; name: string; subject: string; html: string;
  vars: Record<string, string>; customised: boolean; custom: boolean; updated_at: string | null;
};
type Newsletter = { id: string; subject: string; sent_count: number; status: string; created_at: string };

const input = "w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";
const TABS = ["Compose & send", "Templates", "Form notifications", "History"] as const;

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
          <p className="text-[11px] text-graphite/70">The assistant only drafts Testsoft emails, max 5 drafts per email.</p>
        </div>
      )}
    </div>
  );
}

/* ---------------- starter layouts ---------------- */
const STARTERS: { name: string; subject: string; html: string }[] = [
  {
    name: "Company update",
    subject: "A quick update from Testsoft",
    html: `<h2 style="font-family:Inter,Arial,sans-serif;color:#17222E">Hello,</h2>
<p style="font-family:Inter,Arial,sans-serif;color:#17222E;line-height:1.6">We wanted to share a few things happening at Testsoft this quarter.</p>
<ul style="font-family:Inter,Arial,sans-serif;color:#17222E;line-height:1.6">
  <li><strong>New practice:</strong> …</li>
  <li><strong>Client win:</strong> …</li>
  <li><strong>Team:</strong> …</li>
</ul>
<p style="font-family:Inter,Arial,sans-serif;color:#17222E;line-height:1.6">More soon — thanks for reading.</p>`,
  },
  {
    name: "Event / webinar invite",
    subject: "You're invited: Testsoft webinar",
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

/* ---------------- shared ---------------- */

/* {{site_url}} and {{year}} are filled in on send. In a preview the site URL
   is this window's, so the pictures load from wherever the admin is open. */
const fill = (html: string, vars: Record<string, string> = {}) => {
  const all: Record<string, string> = {
    site_url: typeof window === "undefined" ? "" : window.location.origin,
    year: String(new Date().getFullYear()),
    ...vars,
  };
  return html.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_m, k) => all[k] ?? `{{${k}}}`);
};

/* An email is a document of its own, so it is previewed in a frame: the site's
   styles cannot leak into it and its styles cannot leak out. `sandbox` with no
   allowances means nothing in a pasted template can run. */
function MailFrame({ html, title }: { html: string; title: string }) {
  return (
    <iframe
      title={title}
      sandbox=""
      srcDoc={`<!doctype html><html><body style="margin:0;padding:16px;background:#F4F6F8">${html}</body></html>`}
      className="block w-full h-[calc(100vh-17rem)] min-h-[520px] rounded-xl bg-white"
    />
  );
}

/* ---------------- Compose ---------------- */
function Compose() {
  const [subject, setSubject] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [to, setTo] = useState<"subscribers" | "employees" | "custom">("subscribers");
  const [toList, setToList] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [replyTo, setReplyTo] = useState("");
  const [meta, setMeta] = useState<{ subscribers: number; employees: number; from: string } | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  /* The template the message was started from. Its frame is the one the mail
     is sent in; "" means the plain newsletter frame. */
  const [frame, setFrame] = useState("");
  const [picked, setPicked] = useState("");
  const [busy, setBusy] = useState<"" | "send" | "test">("");
  const [files, setFiles] = useState<{ filename: string; contentType: string; dataBase64: string; size: number }[]>([]);
  const [result, setResult] = useState<{ ok: boolean; sent: number; note?: string; error?: string; test?: boolean } | null>(null);
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
    fetch("/api/admin/newsletter").then((r) => r.json()).then((d) =>
      setMeta({ subscribers: d.activeSubscribers ?? 0, employees: d.activeEmployees ?? 0, from: d.from ?? "" })
    ).catch(() => {});
    /* Fetched each time the composer opens, so a template saved a moment ago
       on the Templates tab is already here. */
    fetch("/api/admin/email-templates").then((r) => r.json()).then((d) => setTemplates(d.templates || [])).catch(() => {});
  }, []);

  const mine = templates.filter((t) => t.custom);
  /* The mails the website sends by itself, offered here so one can be sent by
     hand: to someone who wrote in by phone, say. */
  const website = templates.filter((t) => ["contact-ack", "application-ack", "resume-ack"].includes(t.slug));
  const frameHtml = templates.find((t) => t.slug === (frame || "newsletter"))?.html ?? "";
  const framed = splitFrame(frameHtml);
  const listCount = to === "subscribers" ? meta?.subscribers ?? 0 : to === "employees" ? meta?.employees ?? 0 : 0;
  const total = listCount + toList.length + cc.length + bcc.length;
  const badAddress = [...toList, ...cc, ...bcc].some((e) => !isEmail(e)) || (replyTo.trim() !== "" && !isEmail(replyTo.trim()));
  const hasText = contentHtml.replace(/<[^>]+>/g, "").trim().length >= 3;
  const ready = Boolean(subject.trim()) && hasText && !badAddress;
  /* A field nobody filled in would arrive as a blank, or as {{name}}. */
  const unfilled = [...new Set((`${subject} ${contentHtml}`.match(/\{\{\s*[a-z_]+\s*\}\}|\[[a-z][a-z ,-]*\]/gi) ?? []).filter((m) => !/site_url|year/.test(m)))];

  function choose(id: string) {
    setPicked("");
    if (!id) return;
    if (hasText && !confirm("Replace what you have written with this template?")) return;
    const starter = STARTERS.find((x) => `starter:${x.name}` === id);
    if (starter) { setSubject(starter.subject); setContentHtml(starter.html); setFrame(""); return; }
    const t = templates.find((x) => x.slug === id);
    if (!t) return;
    const own = splitFrame(t.html);
    setSubject(t.subject);
    setContentHtml(own ? own.body : t.html);
    setFrame(own ? t.slug : "");
  }

  async function send(test: boolean) {
    if (unfilled.length && !confirm(`These are still placeholders: ${unfilled.join(", ")}\n\nSend anyway?`)) return;
    if (!test && !confirm(`Send "${subject}" to ${total} recipient${total === 1 ? "" : "s"}?`)) return;
    setBusy(test ? "test" : "send"); setResult(null);
    const payload = {
      subject, contentHtml, to, test, frame,
      recipients: toList, cc, bcc,
      replyTo: replyTo.trim() || undefined,
      attachments: files.map(({ filename, contentType, dataBase64 }) => ({ filename, contentType, dataBase64 })),
    };
    const res = await fetch("/api/admin/newsletter", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    setResult({ ...(await res.json()), test });
    setBusy("");
  }

  const audienceLine =
    to === "subscribers" ? `Newsletter subscribers (${meta?.subscribers ?? "…"}), blind-copied`
    : to === "employees" ? `All active employees (${meta?.employees ?? "…"}), blind-copied`
    : "";

  return (
    /* Three columns on a wide screen, so who it goes to, what it says and how it
       will look are all on screen at once and the message sits at the top
       beside its preview. Two columns on a laptop, one on a phone. */
    <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-[340px_minmax(0,1fr)_minmax(0,1.1fr)] items-start">
      <div className="space-y-4 bg-surface border border-line rounded-2xl p-5 xl:col-start-1 xl:row-start-2 2xl:col-start-auto 2xl:row-start-auto">
        <h2 className="display text-lg text-ink">Who it goes to</h2>
        <div className="grid sm:grid-cols-2 2xl:grid-cols-1 gap-3">
          <div>
            <label className="mono-label text-graphite block mb-1.5">Sent by (From)</label>
            <input className={`${input} opacity-70`} value={meta?.from ?? "…"} readOnly title="Set by SMTP_FROM on the server" />
          </div>
          <div>
            <label className="mono-label text-graphite block mb-1.5">Replies go to (optional)</label>
            <input className={`${input} ${replyTo.trim() && !isEmail(replyTo.trim()) ? "border-accent-deep" : ""}`}
              value={replyTo} onChange={(e) => setReplyTo(e.target.value)} placeholder="Same as From" />
          </div>
        </div>

        <div>
          <label className="mono-label text-graphite block mb-1.5">Send to</label>
          <select className={input} value={to} onChange={(e) => setTo(e.target.value as typeof to)}>
            <option value="subscribers">Newsletter subscribers{meta ? ` (${meta.subscribers})` : ""}</option>
            <option value="employees">All active employees{meta ? ` (${meta.employees})` : ""}</option>
            <option value="custom">Only the addresses I add below</option>
          </select>
        </div>
        <EmailChips label={to === "custom" ? "To" : "Also send to (To)"} value={toList} onChange={setToList} />
        <div className="grid sm:grid-cols-2 2xl:grid-cols-1 gap-3">
          <EmailChips label="CC" value={cc} onChange={setCc} placeholder="Optional" />
          <EmailChips label="BCC" value={bcc} onChange={setBcc} placeholder="Optional" />
        </div>
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
      </div>

      <div className="space-y-4 xl:col-start-1 xl:row-start-1 2xl:col-start-auto 2xl:row-start-auto">
        <div>
          <label className="mono-label text-graphite block mb-1.5">Template</label>
          <select className={input} value={picked} onChange={(e) => choose(e.target.value)}>
            <option value="">Select a template to start from…</option>
            {mine.length > 0 && (
              <optgroup label="Your templates">
                {mine.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
              </optgroup>
            )}
            <optgroup label="Website emails">
              {website.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
            </optgroup>
            <optgroup label="Starting layouts">
              {STARTERS.map((x) => <option key={x.name} value={`starter:${x.name}`}>{x.name}</option>)}
            </optgroup>
          </select>
          <p className="text-[11px] text-graphite/70 mt-1.5">
            Choosing one fills in the subject and the message. Change anything you like before sending; the saved template is not altered.
          </p>
        </div>

        <div>
          <label className="mono-label text-graphite block mb-1.5">Subject</label>
          <input className={input} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
        </div>

        <div>
          <label className="mono-label text-graphite block mb-1.5">Message</label>
          <RichEmailEditor value={contentHtml} onChange={setContentHtml} />
          <p className="text-[11px] text-graphite/70 mt-1.5">
            The header and footer are added for you. The preview shows the finished email.
          </p>
        </div>
        <AiAssist context={contentHtml} format="html" threadId={threadId} onDraft={setContentHtml} />

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => send(false)} disabled={busy !== "" || !ready || total === 0}
            className="bg-brand text-white px-6 py-3 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
            {busy === "send" ? "Sending…" : `Send to ${total} recipient${total === 1 ? "" : "s"}`}
          </button>
          <button onClick={() => send(true)} disabled={busy !== "" || !ready}
            className="border border-line text-graphite px-5 py-3 rounded-full font-medium hover:border-ink hover:text-ink transition-colors disabled:opacity-50">
            {busy === "test" ? "Sending…" : "Send a test to me"}
          </button>
        </div>
        {badAddress && <p className="text-sm text-accent-deep">One of the addresses is not valid. It is marked in red.</p>}
        {unfilled.length > 0 && (
          <p className="text-sm text-graphite">Still to fill in: <span className="text-ink">{unfilled.join(", ")}</span></p>
        )}
        {result && (
          <p className={`text-sm ${result.ok ? "text-brand" : "text-accent-deep"}`}>
            {result.ok
              ? result.test ? "Test sent to your own address." : `Sent to ${result.sent} recipient${result.sent === 1 ? "" : "s"}.`
              : (result.error || "Failed.")}
            {result.note ? ` — ${result.note}` : ""}
          </p>
        )}
      </div>

      <div className="xl:sticky xl:top-6 self-start xl:col-start-2 xl:row-start-1 xl:row-span-2 2xl:col-start-auto 2xl:row-start-auto 2xl:row-span-1">
        <p className="mono-label text-graphite mb-2">Preview · as it will arrive</p>
        <div className="border border-line rounded-2xl bg-surface p-3">
          <dl className="px-2 pb-3 text-xs space-y-1">
            {([
              ["From", meta?.from || "…"],
              ["Reply-to", replyTo.trim()],
              ["To", [...toList, to !== "custom" && !toList.length ? "(the sender, recipients are hidden)" : ""].filter(Boolean).join(", ")],
              ["Cc", cc.join(", ")],
              ["Bcc", [audienceLine, ...bcc].filter(Boolean).join(", ")],
              ["Subject", subject],
              ["Attached", files.map((f) => f.filename).join(", ")],
            ] as [string, string][]).filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <dt className="w-16 shrink-0 text-graphite">{k}</dt>
                <dd className="text-ink break-words min-w-0">{v}</dd>
              </div>
            ))}
          </dl>
          <MailFrame
            title="Email preview"
            html={fill(
              framed
                ? joinFrame(framed, contentHtml || "<p style='color:#999'>Nothing yet…</p>")
                : contentHtml,
              { content: contentHtml, unsubscribe_url: "#" }
            )}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Templates ---------------- */
const NEW = "__new";
const BLANK = `<h2 style="font-family:Inter,Arial,sans-serif;color:#17222E">Hello,</h2>
<p style="font-family:Inter,Arial,sans-serif;color:#17222E;line-height:1.6">Write your message here.</p>`;

function Templates() {
  const [items, setItems] = useState<Template[]>([]);
  const [sel, setSel] = useState<string>("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [msg, setMsg] = useState("");
  const threadId = useMemo(() => `tpl-${Date.now()}`, []);

  function pick(t: Template) { setSel(t.slug); setName(t.name); setSubject(t.subject); setHtml(t.html); setMsg(""); }
  function startNew() { setSel(NEW); setName(""); setSubject(""); setHtml(BLANK); setMsg(""); }

  /** `open` is the template to show once the list is back. */
  const load = useCallback((open?: string) => {
    fetch("/api/admin/email-templates").then((r) => r.json()).then((d) => {
      const list: Template[] = d.templates || [];
      setItems(list);
      const t = list.find((x) => x.slug === open) ?? (open === undefined ? undefined : list[0]);
      if (t) pick(t);
    });
  }, []);
  useEffect(() => { load(""); }, [load]);

  const isNew = sel === NEW;
  const current = items.find((t) => t.slug === sel);
  const custom = isNew || Boolean(current?.custom);
  /* A template of your own is just a message. A built-in one is a whole email,
     and only the part between its markers is the message; the rest is the
     shared header and footer, which is not something to retype per template. */
  const framed = custom ? null : splitFrame(html);
  const visual = custom || Boolean(framed);
  const body = framed ? framed.body : html;
  const setBody = (next: string) => setHtml(framed ? joinFrame(framed, next) : next);

  async function save() {
    setMsg("");
    const res = await fetch(isNew ? "/api/admin/email-templates" : `/api/admin/email-templates/${sel}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, subject, html }),
    });
    const d = await res.json();
    if (!res.ok) { setMsg(d.error || "Failed"); return; }
    load(isNew ? d.slug : sel);
    setMsg(isNew ? "Created ✓ It is now offered in Compose." : "Saved ✓");
  }
  async function reset() {
    if (!confirm(custom ? "Delete this template?" : "Restore the built-in default for this template?")) return;
    await fetch(`/api/admin/email-templates/${sel}`, { method: "DELETE" });
    load(custom ? "" : sel);
  }

  /* The newsletter template is only a frame around a message, so its preview
     gets a stand-in message; the others show their placeholders as written. */
  const preview = sel === "newsletter"
    ? fill(html, { content: "<p style='font-family:Inter,Arial,sans-serif;color:#17222E'>Your message appears here.</p>", unsubscribe_url: "#" })
    : custom
      ? (() => {
          const wrap = splitFrame(items.find((t) => t.slug === "newsletter")?.html ?? "");
          return fill(wrap ? joinFrame(wrap, html) : html, { unsubscribe_url: "#" });
        })()
      : fill(html);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {items.map((t) => (
            <button key={t.slug} onClick={() => pick(t)}
              className={`mono-label px-3 py-1.5 rounded-full border ${sel === t.slug ? "bg-brand text-white border-brand" : "border-line text-graphite hover:border-brand"}`}>
              {t.name}{t.customised ? " •" : ""}
            </button>
          ))}
          <button onClick={startNew}
            className={`mono-label px-3 py-1.5 rounded-full border border-dashed ${isNew ? "bg-brand text-white border-brand" : "border-brand/60 text-brand hover:bg-brand hover:text-white"}`}>
            + New template
          </button>
        </div>
        {(current || isNew) && (
          <>
            {custom && (
              <div>
                <label className="mono-label text-graphite block mb-1.5">Template name</label>
                <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monthly update" />
              </div>
            )}
            <div>
              <label className="mono-label text-graphite block mb-1.5">Subject</label>
              <input className={input} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
            </div>
            <div>
              <label className="mono-label text-graphite block mb-1.5">Message</label>
              {visual ? (
                <RichEmailEditor value={body} onChange={setBody} fields={custom ? undefined : current?.vars} minHeight={320} />
              ) : (
                <>
                  <textarea className={`${input} min-h-[320px] font-mono text-xs`} value={html} onChange={(e) => setHtml(e.target.value)} />
                  <p className="text-[11px] text-accent-deep mt-1.5">
                    This template was saved in an older format, so it can only be edited as HTML. Reset it to the default to get the visual editor.
                  </p>
                </>
              )}
            </div>
            <AiAssist context={body} format="html" threadId={threadId} onDraft={setBody} />
            <p className="text-[11px] text-graphite/70">
              {custom
                ? "Your own template. Pick it under Template in Compose to send it. The header and footer are added for you."
                : "Words in {{double braces}} are filled in automatically when the email is sent. Use “Insert field” to add one. The header and footer are shared by every email."}
            </p>
            <div className="flex items-center gap-3">
              <button onClick={save} className="bg-brand text-white px-5 py-2.5 rounded-full font-medium hover:bg-brand-deep">
                {isNew ? "Create template" : "Save template"}
              </button>
              {current?.custom && <button onClick={reset} className="text-sm text-accent-deep hover:underline">Delete template</button>}
              {current?.customised && <button onClick={reset} className="text-sm text-accent-deep hover:underline">Reset to default</button>}
              {msg && <span className="text-sm text-brand">{msg}</span>}
            </div>
          </>
        )}
      </div>
      <div className="lg:sticky lg:top-6 self-start">
        <p className="mono-label text-graphite mb-2">Preview</p>
        <div className="border border-line rounded-2xl bg-surface p-3">
          <MailFrame title="Template preview" html={preview} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Form notifications ---------------- */
type NotifyRow = { key: string; label: string; recipients: string[] };

function Notifications() {
  const [forms, setForms] = useState<NotifyRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/admin/notify").then((r) => r.json()).then((d) => setForms(d.forms || [])).catch(() => setForms([]));
  }, []);

  const bad = (forms ?? []).some((f) => f.recipients.some((e) => !isEmail(e)));

  async function save() {
    if (!forms) return;
    setBusy(true); setMsg(""); setErr("");
    const res = await fetch("/api/admin/notify", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ forms: Object.fromEntries(forms.map((f) => [f.key, f.recipients])) }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error || "Could not save."); return; }
    setForms(d.forms); setMsg("Saved ✓");
  }

  if (!forms) return <p className="text-graphite">Loading…</p>;
  return (
    <div className="max-w-2xl bg-surface border border-line rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="display text-xl text-ink">Who is emailed when a form is submitted</h2>
        <p className="mt-1 text-sm text-graphite">
          Add as many addresses as you like for each form. Every submission is also kept in the admin, under
          Enquiries or Job applications, whatever is set here.
        </p>
      </div>
      {forms.map((f) => (
        <div key={f.key}>
          <EmailChips
            label={f.label}
            value={f.recipients}
            onChange={(next) => setForms((all) => (all ?? []).map((x) => (x.key === f.key ? { ...x, recipients: next } : x)))}
          />
          {f.recipients.length === 0 && (
            <p className="text-[11px] text-graphite/80 mt-1">Nobody listed, so this goes to every admin account.</p>
          )}
        </div>
      ))}
      {err && <p className="text-sm text-accent-deep">{err}</p>}
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={busy || bad}
          className="bg-brand text-white px-5 py-2.5 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
          {busy ? "Saving…" : "Save"}
        </button>
        {msg && <span className="text-sm text-brand">{msg}</span>}
      </div>
      <p className="text-[11px] text-graphite/80">
        The person who filled in the form gets an acknowledgement as well. Its wording is on the Templates tab.
      </p>
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
    <div className="admin-wide">
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
      {tab === "Form notifications" && <Notifications />}
      {tab === "History" && <History />}
    </div>
  );
}
