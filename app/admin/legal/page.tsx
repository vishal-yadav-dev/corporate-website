"use client";

import { useEffect, useState } from "react";
import LegalBody from "@/components/LegalBody";

type Policy = { slug: string; title: string; body: string; edited: boolean; updatedAt: string | null };

const input =
  "w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

/**
 * Policy editor: privacy, terms, SMS and cookies.
 *
 * The preview on the right is rendered by the same component the public page
 * uses, from the text in the box, so it shows the draft and not what is
 * already published. Nothing reaches the site until Publish.
 */
export default function AdminLegalPage() {
  const [pages, setPages] = useState<Policy[]>([]);
  const [slug, setSlug] = useState("privacy");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const current = pages.find((p) => p.slug === slug);
  const dirty = Boolean(current) && (title !== current!.title || body !== current!.body);

  async function load(keep?: string) {
    const d = await fetch("/api/admin/legal").then((r) => r.json()).catch(() => ({}));
    if (d.error) { setErr(d.error); return; }
    const list: Policy[] = d.pages || [];
    setPages(list);
    const p = list.find((x) => x.slug === (keep ?? slug)) ?? list[0];
    if (p) { setSlug(p.slug); setTitle(p.title); setBody(p.body); }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  function pick(next: Policy) {
    if (next.slug === slug) return;
    if (dirty && !confirm("You have unpublished changes to this policy. Leave without publishing?")) return;
    setSlug(next.slug); setTitle(next.title); setBody(next.body); setMsg(""); setErr("");
  }

  async function publish() {
    setBusy(true); setMsg(""); setErr("");
    const res = await fetch("/api/admin/legal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, body }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error || "Could not publish."); return; }
    await load(slug);
    setMsg("Published. The live page is updated.");
  }

  async function reset() {
    if (!confirm("Replace this policy with the original text? Your edits to it will be removed from the site.")) return;
    setBusy(true); setMsg(""); setErr("");
    const res = await fetch("/api/admin/legal", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    setBusy(false);
    if (!res.ok) { setErr("Could not reset."); return; }
    await load(slug);
    setMsg("Back to the original text.");
  }

  return (
    <div className="admin-wide">
      <div className="text-center">
        <p className="mono-label text-accent-deep mb-2">Policies</p>
        <h1 className="display text-3xl text-ink">Legal pages</h1>
        <p className="mt-2 text-graphite text-sm max-w-xl mx-auto">
          Edit the text on the left and check it on the right. The site only changes when you publish.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {pages.map((p) => (
          <button key={p.slug} onClick={() => pick(p)}
            className={`mono-label px-4 py-2 rounded-full border transition-colors ${slug === p.slug ? "bg-brand text-white border-brand" : "text-graphite border-line-blue hover:border-brand hover:text-brand"}`}>
            {p.title}
          </button>
        ))}
      </div>

      {current && (
        <div className="mt-8 grid lg:grid-cols-2 gap-6 items-start">
          <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
            <div>
              <label className="mono-label text-graphite block mb-1.5">Page title</label>
              <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="mono-label text-graphite block mb-1.5">Policy text</label>
              <textarea
                className={`${input} min-h-[520px] resize-y font-mono text-sm leading-relaxed`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                spellCheck
              />
              <p className="text-[11px] text-graphite/80 mt-2 leading-relaxed">
                Leave a blank line between paragraphs. Start a line with <code>## </code> for a heading and{" "}
                <code>- </code> for a bullet. Wrap words in <code>**two stars**</code> for bold. A link is{" "}
                <code>[text](/privacy)</code>.
              </p>
            </div>

            {err && <p className="text-sm text-accent-deep">{err}</p>}
            {msg && <p className="text-sm text-brand">{msg}</p>}

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={publish} disabled={busy || !dirty}
                className="bg-brand text-white px-5 py-2.5 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
                {busy ? "Working…" : "Publish"}
              </button>
              {dirty && (
                <button onClick={() => { setTitle(current.title); setBody(current.body); }}
                  className="border border-line text-graphite px-5 py-2.5 rounded-full font-medium hover:border-ink hover:text-ink transition-colors">
                  Discard changes
                </button>
              )}
              <a href={`/${slug}`} target="_blank" rel="noreferrer" className="text-sm text-accent-deep hover:underline">
                Open live page ↗
              </a>
              {current.edited && (
                <button onClick={reset} disabled={busy} className="text-sm text-graphite hover:text-ink hover:underline ml-auto">
                  Reset to original
                </button>
              )}
            </div>
            <p className="text-[11px] text-graphite/80">
              {current.edited && current.updatedAt
                ? `Last published ${new Date(current.updatedAt).toLocaleString()}`
                : "Showing the original text. It has not been edited here yet."}
            </p>
          </div>

          <div className="lg:sticky lg:top-8">
            <p className="mono-label text-graphite mb-2">
              Preview {dirty ? "· unpublished changes" : "· matches the live page"}
            </p>
            <div className="bg-paper border border-line rounded-2xl p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
              <p className="mono-label text-accent-deep mb-3">Legal</p>
              <h2 className="display text-4xl text-ink mb-8">{title || "Untitled"}</h2>
              <LegalBody body={body} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
