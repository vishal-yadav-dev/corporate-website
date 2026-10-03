"use client";

import { useEffect, useState } from "react";
import CollectionEditor, { type EditorField } from "@/components/admin/CollectionEditor";

/* ---------- previews ---------- */

function logoSrc(it: Record<string, unknown>) {
  return it.logo_id ? `/api/images/${it.logo_id}` : String(it.logo_url || "");
}

function PartnerPreview(it: Record<string, unknown>) {
  const src = logoSrc(it);
  return (
    <div className="flex flex-col items-center gap-2 py-3">
      {src
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={src} alt={String(it.name)} className="h-9 w-auto max-w-[160px] object-contain" />
        : <span className="display text-lg text-ink">{String(it.name || "—")}</span>}
      <span className="text-[11px] text-graphite uppercase tracking-wide">{String(it.kind || "partner")}</span>
    </div>
  );
}

function OfficePreview(it: Record<string, unknown>) {
  return (
    <div className="text-left">
      <p className="mono-label text-accent-deep mb-1">{String(it.role || "Office")}</p>
      <h3 className="display text-lg text-ink">{String(it.region || "—")}</h3>
      <p className="mt-1 text-xs text-graphite leading-relaxed">{String(it.address || "")}</p>
      <p className="text-xs text-brand mt-1">{String(it.tel || "")}</p>
    </div>
  );
}

function PracticePreview(it: Record<string, unknown>) {
  const src = logoSrc(it);
  const stack = String(it.stack || "").split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <div className="text-left">
      {src
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={src} alt="" className="h-7 w-auto mb-2" />
        : null}
      <h3 className="display text-xl text-ink">{String(it.name || "—")}</h3>
      <p className="text-xs text-accent-deep">{String(it.tag || "")}</p>
      <p className="text-xs text-graphite mt-2 line-clamp-3">{String(it.body || "")}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {stack.map((s) => <span key={s} className="text-[10px] border border-line-blue rounded-full px-2 py-0.5 text-graphite">{s}</span>)}
      </div>
    </div>
  );
}

/* ---------- field schemas ---------- */

const PARTNER_FIELDS: EditorField[] = [
  { key: "name", label: "Name", type: "text", placeholder: "Salesforce" },
  { key: "kind", label: "Type", type: "select", options: ["partner", "client"] },
  { key: "logo_id", label: "Logo (upload)", type: "image", help: "PNG/SVG with transparent background works best" },
  { key: "logo_url", label: "…or logo URL", type: "text", placeholder: "https://…/logo.svg" },
  { key: "website", label: "Website", type: "text", placeholder: "https://…" },
  { key: "sort_order", label: "Sort order", type: "number" },
  { key: "is_active", label: "Visible", type: "checkbox", help: "Show on the site" },
];

const OFFICE_FIELDS: EditorField[] = [
  { key: "region", label: "Region", type: "text", placeholder: "Texas — USA" },
  { key: "role", label: "Role", type: "text", placeholder: "Headquarters" },
  { key: "address", label: "Address", type: "textarea", placeholder: "Full postal address (used for the map)" },
  { key: "tel", label: "Phone", type: "text", placeholder: "+1 555 000 0000" },
  { key: "sort_order", label: "Sort order", type: "number" },
  { key: "is_active", label: "Visible", type: "checkbox", help: "Show on Contact + footer" },
];

const PRACTICE_FIELDS: EditorField[] = [
  { key: "name", label: "Name", type: "text", placeholder: "Salesforce" },
  { key: "tag", label: "Tagline", type: "text", placeholder: "CRM & Digital Experience" },
  { key: "body", label: "Description", type: "textarea" },
  { key: "stack", label: "Stack chips", type: "text", placeholder: "Sales Cloud, Service Cloud, Apex / LWC", full: true, help: "Comma-separated" },
  { key: "logo_id", label: "Logo (upload)", type: "image" },
  { key: "logo_url", label: "…or logo URL", type: "text" },
  { key: "sort_order", label: "Sort order", type: "number" },
  { key: "is_active", label: "Visible", type: "checkbox", help: "Show on Practices + homepage" },
];

const STAFFING_FIELDS: EditorField[] = [
  { key: "name", label: "Service name", type: "text", placeholder: "Contract Staffing" },
  { key: "line", label: "One-liner", type: "text", placeholder: "W-2 and 1099 talent, deployed fast" },
  { key: "body", label: "Description", type: "textarea" },
  { key: "points", label: "Highlights", type: "textarea", full: true, help: "One per line" },
  { key: "sort_order", label: "Sort order", type: "number" },
  { key: "is_active", label: "Visible", type: "checkbox", help: "Show on Services page" },
];

function StaffingPreview(it: Record<string, unknown>) {
  const points = String(it.points || "").split("\n").map((s) => s.trim()).filter(Boolean);
  return (
    <div className="text-left">
      <h3 className="display text-xl text-ink">{String(it.name || "—")}</h3>
      <p className="text-xs text-accent-deep">{String(it.line || "")}</p>
      <p className="text-xs text-graphite mt-2 line-clamp-3">{String(it.body || "")}</p>
      <ul className="mt-2 space-y-0.5">
        {points.slice(0, 4).map((p) => <li key={p} className="text-[11px] text-graphite">— {p}</li>)}
      </ul>
    </div>
  );
}

const ABOUT_KEYS = [
  { key: "about.eyebrow", label: "About — eyebrow", placeholder: "About Us" },
  { key: "about.title", label: "About — heading", placeholder: "Enterprise application specialists." },
  { key: "about.body", label: "About — body", placeholder: "A few paragraphs about the company.", textarea: true },
  { key: "company.mission", label: "Mission statement", textarea: true },
];

const AWARD_FIELDS: EditorField[] = [
  { key: "year", label: "Year / label", type: "text", placeholder: "2020" },
  { key: "title", label: "Award", type: "text", placeholder: "Inc. 500 — Fastest-Growing Private Companies" },
  { key: "image_id", label: "Badge image (upload)", type: "image", help: "Award logo / badge — optional" },
  { key: "image_url", label: "…or image URL", type: "text" },
  { key: "sort_order", label: "Sort order", type: "number" },
  { key: "is_active", label: "Visible", type: "checkbox", help: "Show on Company page" },
];

function AwardPreview(it: Record<string, unknown>) {
  const src = it.image_id ? `/api/images/${it.image_id}` : String(it.image_url || "");
  return (
    <div className="flex items-center gap-3 text-left">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-10 w-10 object-contain rounded bg-white p-1" />
      ) : (
        <span className="display text-lg text-brand">{String(it.year || "—")}</span>
      )}
      <p className="text-sm text-ink">{String(it.title || "—")}</p>
    </div>
  );
}

const CASE_FIELDS: EditorField[] = [
  { key: "title", label: "Title", type: "text", placeholder: "One service view for a regional utility" },
  { key: "client", label: "Client", type: "text", help: "Leave blank where the name cannot be disclosed" },
  { key: "industry", label: "Industry", type: "text", placeholder: "Utilities" },
  { key: "challenge", label: "Challenge", type: "textarea" },
  { key: "approach", label: "Approach", type: "textarea" },
  { key: "solution", label: "Solution", type: "textarea" },
  { key: "technology", label: "Technology", type: "text", help: "Comma separated" },
  { key: "delivery_model", label: "Delivery model", type: "text" },
  { key: "outcome", label: "Outcome", type: "textarea", help: "Qualitative is fine. Never invent a metric." },
  { key: "quote", label: "Client quote", type: "textarea" },
  { key: "quote_by", label: "Quote attribution", type: "text" },
  { key: "image_url", label: "Image URL", type: "text" },
  { key: "sort_order", label: "Order", type: "number" },
  { key: "is_active", label: "Visible", type: "checkbox" },
];

const TESTIMONIAL_FIELDS: EditorField[] = [
  { key: "kind", label: "Kind", type: "text", placeholder: "client = Client Testimonials, candidate = Employee Testimonials" },
  { key: "quote", label: "Quote", type: "textarea" },
  { key: "person", label: "Name or role", type: "text" },
  { key: "title", label: "Job title", type: "text" },
  { key: "organization", label: "Organization", type: "text" },
  { key: "context", label: "Context", type: "text", help: "Engagement type, or candidate discipline" },
  { key: "logo_url", label: "Logo URL", type: "text" },
  { key: "sort_order", label: "Order", type: "number" },
  { key: "is_active", label: "Visible", type: "checkbox" },
];

const BLOG_FIELDS: EditorField[] = [
  { key: "title", label: "Title", type: "text", full: true },
  { key: "tag", label: "Category", type: "text", placeholder: "Workforce, Technology, AI, Public Sector…" },
  { key: "published_at", label: "Published", type: "text", placeholder: "2026-03-26 (YYYY-MM-DD)", help: "ISO date. The page prints it as 26 March 2026 and sorts newest first." },
  { key: "author_name", label: "Author", type: "text" },
  { key: "author_role", label: "Author role", type: "text" },
  { key: "excerpt", label: "Card summary", type: "textarea", full: true, help: "One or two lines. Shown on the blog index and the homepage." },
  { key: "image_url", label: "Image URL", type: "text", full: true, placeholder: "/insights/platform.jpg" },
  { key: "image_alt", label: "Image description", type: "text", full: true, help: "What the picture shows, for screen readers." },
  { key: "intro", label: "Opening paragraph", type: "textarea", full: true },
  { key: "sections_json", label: "Body (JSON)", type: "textarea", full: true,
    help: 'A list of sections: [{"heading":"…","paras":["…"],"list":["…"]}]. `list` is optional.' },
  { key: "takeaways_json", label: "In short (JSON)", type: "textarea", full: true, help: 'A list of lines: ["…","…"]' },
  { key: "accent", label: "Colour (0-5)", type: "number", help: "Which prism colour the post carries." },
  { key: "sort_order", label: "Order", type: "number" },
  { key: "is_active", label: "Published", type: "checkbox" },
];

const TABS = ["Partners & clients", "Offices", "Practices", "Services", "Case studies", "Testimonials", "Awards", "Blog", "About Us"] as const;

function AboutEditor() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content").then((r) => r.json()).then((d) => {
      const map: Record<string, string> = {};
      for (const row of d.content || []) map[row.key] = row.value;
      setValues(map);
    });
  }, []);

  async function save() {
    setBusy(true); setSaved(false);
    const entries = ABOUT_KEYS.map((k) => ({ key: k.key, value: values[k.key] ?? "" }));
    await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ entries }) });
    setBusy(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  const input = "w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-ink focus:border-brand focus:outline-none transition-colors";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center mb-6">
        <p className="mono-label text-accent-deep mb-2">About Us</p>
        <h1 className="display text-3xl text-ink">Company copy</h1>
      </div>
      <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
        {ABOUT_KEYS.map((k) => (
          <div key={k.key}>
            <label className="mono-label text-graphite block mb-1.5">{k.label}</label>
            {k.textarea
              ? <textarea className={`${input} min-h-[110px] resize-y`} value={values[k.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [k.key]: e.target.value }))} placeholder={k.placeholder} />
              : <input className={input} value={values[k.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [k.key]: e.target.value }))} placeholder={k.placeholder} />}
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={busy} className="bg-brand text-white px-5 py-2.5 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
            {busy ? "Saving…" : "Save changes"}
          </button>
          {saved && <span className="text-sm text-brand">Saved ✓</span>}
        </div>
      </div>
    </div>
  );
}

export default function SiteContentPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Partners & clients");

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`mono-label px-4 py-2 rounded-full border transition-colors ${tab === t ? "bg-brand text-white border-brand" : "text-graphite border-line-blue hover:border-brand hover:text-brand"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Partners & clients" && (
        <CollectionEditor
          type="partners" title="Partners & clients" imageSlot="partner"
          description="Logos shown across the homepage, practices, company, contact and footer. Upload a logo or paste a URL — a plain name is used if neither is set."
          fields={PARTNER_FIELDS}
          defaults={{ name: "", kind: "partner", logo_id: "", logo_url: "", website: "", sort_order: 0, is_active: true }}
          renderPreview={PartnerPreview}
        />
      )}
      {tab === "Offices" && (
        <CollectionEditor
          type="offices" title="Office locations"
          description="Shown on the Contact page (with a Google map) and in the footer."
          fields={OFFICE_FIELDS}
          defaults={{ region: "", role: "", address: "", tel: "", sort_order: 0, is_active: true }}
          renderPreview={OfficePreview}
        />
      )}
      {tab === "Practices" && (
        <CollectionEditor
          type="practices" title="Practices" imageSlot="practice"
          description="The platform practices shown on the Practices page and homepage grid."
          fields={PRACTICE_FIELDS}
          defaults={{ name: "", tag: "", body: "", stack: "", logo_id: "", logo_url: "", sort_order: 0, is_active: true }}
          renderPreview={PracticePreview}
        />
      )}
      {tab === "Services" && (
        <CollectionEditor
          type="staffing" title="Services"
          description="The service blocks shown on the Services page."
          fields={STAFFING_FIELDS}
          defaults={{ name: "", line: "", body: "", points: "", sort_order: 0, is_active: true }}
          renderPreview={StaffingPreview}
        />
      )}
      {tab === "Case studies" && (
        <CollectionEditor
          type="case_studies" title="Case studies"
          description="Shown on /company#client-success. Never invent metrics — if an outcome cannot be quantified publicly, describe it qualitatively."
          fields={CASE_FIELDS}
          defaults={{ title: "", client: "", industry: "", challenge: "", approach: "", solution: "", technology: "", delivery_model: "", outcome: "", quote: "", quote_by: "", image_url: "", sort_order: 0, is_active: true }}
          renderPreview={(it) => (
            <div>
              <p className="text-sm text-ink font-medium">{String(it.title || "Untitled")}</p>
              <p className="text-xs text-graphite mt-0.5">{[it.client, it.industry].filter(Boolean).join(" · ")}</p>
            </div>
          )}
        />
      )}

      {tab === "Blog" && (
        <CollectionEditor
          type="blog_posts" title="Blog"
          description="Posts on /blog and the three cards on the homepage. The slug is taken from the title on first save and then stays put, so an existing link keeps working when a title is reworded."
          fields={BLOG_FIELDS}
          defaults={{
            title: "", tag: "Technology", excerpt: "", image_url: "", image_alt: "",
            author_name: "", author_role: "", published_at: new Date().toISOString().slice(0, 10),
            accent: 1, intro: "", sections_json: "[]", takeaways_json: "[]",
            sort_order: 0, is_active: true,
          }}
          renderPreview={(it) => (
            <div>
              <p className="mono-label text-accent-deep">{String(it.tag || "")} · {String(it.published_at || "")}</p>
              <p className="text-ink mt-1">{String(it.title || "Untitled")}</p>
              <p className="text-sm text-graphite mt-1">{String(it.excerpt || "")}</p>
              {/* Who touched it, so a second admin knows whose work this is. */}
              <p className="mono-label text-graphite/70 mt-2">
                Added by {String(it.created_by || "—")}
                {it.updated_by && it.updated_by !== it.created_by ? ` · last edited by ${String(it.updated_by)}` : ""}
              </p>
            </div>
          )}
        />
      )}

      {tab === "Testimonials" && (
        <CollectionEditor
          type="testimonials" title="Testimonials"
          description="Quote walls on Who We Are. kind 'client' feeds Client Testimonials, 'candidate' feeds Employee Testimonials. The stored values stay as they are so existing rows keep working. Publish only with permission."
          fields={TESTIMONIAL_FIELDS}
          defaults={{ kind: "client", quote: "", person: "", title: "", organization: "", context: "", logo_url: "", sort_order: 0, is_active: true }}
          renderPreview={(it) => (
            <div>
              <p className="text-sm text-ink line-clamp-2">{String(it.quote || "")}</p>
              <p className="text-xs text-graphite mt-1">{[it.person, it.organization, it.kind].filter(Boolean).join(" · ")}</p>
            </div>
          )}
        />
      )}

      {tab === "Awards" && (
        <CollectionEditor
          type="awards" title="Awards & recognition" imageSlot="award"
          description="Shown on the Company page. Add a badge image or leave it to show the year."
          fields={AWARD_FIELDS}
          defaults={{ year: "", title: "", image_id: "", image_url: "", sort_order: 0, is_active: true }}
          renderPreview={AwardPreview}
        />
      )}
      {tab === "About Us" && <AboutEditor />}
    </div>
  );
}
