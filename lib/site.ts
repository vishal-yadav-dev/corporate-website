import "server-only";
import { q } from "@/lib/db";
import { PARTNERS as PARTNERS_FALLBACK, LOCATIONS, PRACTICES as PRACTICES_FALLBACK, PRACTICE_LOGOS, STAFFING as STAFFING_FALLBACK, AWARDS as AWARDS_FALLBACK, LEADERSHIP as LEADERSHIP_FALLBACK } from "@/lib/data";

/* ------------------------------------------------------------------ *
 * Editable-collection registry — used by the admin CRUD API and the
 * public site helpers below. Keep field lists in sync with db/schema.sql.
 * ------------------------------------------------------------------ */

export type FieldType = "text" | "int" | "bool";
export type Field = { name: string; type: FieldType; default?: unknown; required?: boolean };

export type Collection = {
  table: string;
  order: string;
  fields: Field[];
  /** derive a unique slug from another field on insert */
  slugFrom?: string;
};

export const COLLECTIONS: Record<string, Collection> = {
  partners: {
    table: "partners",
    order: "sort_order ASC, created_at ASC",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "kind", type: "text", default: "partner" },
      { name: "logo_id", type: "text" },
      { name: "logo_url", type: "text" },
      { name: "website", type: "text" },
      { name: "sort_order", type: "int", default: 0 },
      { name: "is_active", type: "bool", default: true },
    ],
  },
  offices: {
    table: "offices",
    order: "sort_order ASC, created_at ASC",
    fields: [
      { name: "region", type: "text", required: true },
      { name: "role", type: "text" },
      { name: "address", type: "text" },
      { name: "tel", type: "text" },
      { name: "sort_order", type: "int", default: 0 },
      { name: "is_active", type: "bool", default: true },
    ],
  },
  practices: {
    table: "practices",
    order: "sort_order ASC, created_at ASC",
    slugFrom: "name",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "tag", type: "text" },
      { name: "body", type: "text" },
      { name: "stack", type: "text" },
      { name: "logo_id", type: "text" },
      { name: "logo_url", type: "text" },
      { name: "sort_order", type: "int", default: 0 },
      { name: "is_active", type: "bool", default: true },
    ],
  },
  staffing: {
    table: "staffing",
    order: "sort_order ASC, created_at ASC",
    slugFrom: "name",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "group_key", type: "text", default: "workforce" },
      { name: "line", type: "text" },
      { name: "body", type: "text" },
      { name: "points", type: "text" },
      { name: "sort_order", type: "int", default: 0 },
      { name: "is_active", type: "bool", default: true },
    ],
  },
  case_studies: {
    table: "case_studies",
    order: "sort_order ASC, created_at ASC",
    slugFrom: "title",
    fields: [
      { name: "title", type: "text", required: true },
      { name: "client", type: "text" },
      { name: "industry", type: "text" },
      { name: "challenge", type: "text" },
      { name: "approach", type: "text" },
      { name: "solution", type: "text" },
      { name: "technology", type: "text" },
      { name: "delivery_model", type: "text" },
      { name: "outcome", type: "text" },
      { name: "quote", type: "text" },
      { name: "quote_by", type: "text" },
      { name: "image_id", type: "text" },
      { name: "image_url", type: "text" },
      { name: "sort_order", type: "int", default: 0 },
      { name: "is_active", type: "bool", default: true },
    ],
  },
  testimonials: {
    table: "testimonials",
    order: "sort_order ASC, created_at ASC",
    fields: [
      { name: "kind", type: "text", default: "client" },
      { name: "quote", type: "text", required: true },
      { name: "person", type: "text" },
      { name: "title", type: "text" },
      { name: "organization", type: "text" },
      { name: "context", type: "text" },
      { name: "logo_id", type: "text" },
      { name: "logo_url", type: "text" },
      { name: "sort_order", type: "int", default: 0 },
      { name: "is_active", type: "bool", default: true },
    ],
  },
  awards: {
    table: "awards",
    order: "sort_order ASC, created_at ASC",
    fields: [
      { name: "year", type: "text" },
      { name: "title", type: "text", required: true },
      { name: "image_id", type: "text" },
      { name: "image_url", type: "text" },
      { name: "sort_order", type: "int", default: 0 },
      { name: "is_active", type: "bool", default: true },
    ],
  },
};

/* ------------------------------------------------------------------ *
 * Public read helpers (server components). Each falls back to the
 * static data in lib/data.ts when the table is empty, so the site
 * still renders before anything is added in the admin.
 * ------------------------------------------------------------------ */

export type PartnerView = { name: string; logo: string; website: string };
export type OfficeView = { region: string; role: string; address: string; tel: string };
export type PracticeView = {
  id: string; name: string; tag: string; body: string; stack: string[]; logo: string;
};

function logoSrc(logo_id: string | null, logo_url: string): string {
  return logo_id ? `/api/images/${logo_id}` : logo_url || "";
}

export async function getPartners(): Promise<PartnerView[]> {
  try {
    const rows = await q<{ name: string; logo_id: string | null; logo_url: string; website: string }>(
      "SELECT name, logo_id, logo_url, website FROM partners WHERE is_active = true ORDER BY sort_order ASC, created_at ASC"
    );
    if (rows.length) {
      return rows.map((r) => ({ name: r.name, logo: logoSrc(r.logo_id, r.logo_url), website: r.website }));
    }
  } catch { /* table missing → fallback */ }
  return PARTNERS_FALLBACK.map((p) => ({ name: p.name, logo: p.logo, website: "" }));
}

export async function getOffices(): Promise<OfficeView[]> {
  try {
    const rows = await q<OfficeView>(
      "SELECT region, role, address, tel FROM offices WHERE is_active = true ORDER BY sort_order ASC, created_at ASC"
    );
    if (rows.length) return rows;
  } catch { /* fallback */ }
  return LOCATIONS.map((l) => ({ region: l.region, role: l.role, address: l.address, tel: l.tel }));
}

export async function getPractices(): Promise<PracticeView[]> {
  try {
    const rows = await q<{
      slug: string; name: string; tag: string; body: string; stack: string;
      logo_id: string | null; logo_url: string;
    }>(
      "SELECT slug, name, tag, body, stack, logo_id, logo_url FROM practices WHERE is_active = true ORDER BY sort_order ASC, created_at ASC"
    );
    if (rows.length) {
      return rows.map((r) => ({
        id: r.slug,
        name: r.name,
        tag: r.tag,
        body: r.body,
        stack: r.stack.split(",").map((s) => s.trim()).filter(Boolean),
        logo: logoSrc(r.logo_id, r.logo_url),
      }));
    }
  } catch { /* fallback */ }
  return PRACTICES_FALLBACK.map((p) => ({
    id: p.id, name: p.name, tag: p.tag, body: p.body,
    stack: [...p.stack], logo: PRACTICE_LOGOS[p.id] || "",
  }));
}

export type StaffingView = { id: string; name: string; line: string; body: string; points: string[]; group: "technology" | "workforce" };

export async function getStaffing(): Promise<StaffingView[]> {
  try {
    const rows = await q<{ slug: string; name: string; line: string; body: string; points: string; group_key: string }>(
      "SELECT slug, name, line, body, points, group_key FROM staffing WHERE is_active = true ORDER BY sort_order ASC, created_at ASC"
    );
    if (rows.length) {
      return rows.map((r) => ({
        id: r.slug,
        name: r.name,
        line: r.line,
        body: r.body,
        points: r.points.split("\n").map((s) => s.replace(/^[-*•]\s*/, "").trim()).filter(Boolean),
        group: (r.group_key === "technology" ? "technology" : "workforce") as "technology" | "workforce",
      }));
    }
  } catch { /* fallback */ }
  return STAFFING_FALLBACK.map((s) => ({
    id: s.id, name: s.name, line: s.line, body: s.body, points: [...s.points],
    group: s.group as "technology" | "workforce",
  }));
}

export type AwardView = { year: string; title: string; image: string };

export async function getAwards(): Promise<AwardView[]> {
  try {
    const rows = await q<{ year: string; title: string; image_id: string | null; image_url: string }>(
      "SELECT year, title, image_id, image_url FROM awards WHERE is_active = true ORDER BY sort_order ASC, created_at ASC"
    );
    if (rows.length) {
      return rows.map((r) => ({ year: r.year, title: r.title, image: logoSrc(r.image_id, r.image_url) }));
    }
  } catch { /* fallback */ }
  return AWARDS_FALLBACK.map((a) => ({ year: a.year, title: a.title, image: "" }));
}

export type BannerView = {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_url: string;
  media_id: string | null;
  sort_order: number;
  background_fx: string;
  media_mime_type: string | null;
  media_alt: string | null;
};

/** Homepage banners, server-side, so the hero headline ships in the HTML
    instead of waiting on hydration plus a round trip to the database. */
export async function getBanners(): Promise<BannerView[]> {
  try {
    return await q<BannerView>(`
      SELECT
        b.id, b.title, b.subtitle, b.cta_text, b.cta_url, b.media_id, b.sort_order, b.background_fx,
        i.mime_type as media_mime_type, i.alt as media_alt
      FROM banners b
      LEFT JOIN site_images i ON b.media_id = i.id
      WHERE b.is_active = true
      ORDER BY b.sort_order ASC, b.created_at DESC
    `);
  } catch { /* table missing → hero falls back to its static copy */ }
  return [];
}

export type LeaderView = {
  id: string;
  name: string;
  title: string;
  bio: string;
  linkedin_url: string;
  photo_id: string | null;
  photo_url: string;
};

/** Leadership team, server-side. Rendering the hardcoded fallback first and
    swapping after a client fetch flashed placeholder people at visitors. */
export async function getLeaders(): Promise<LeaderView[]> {
  try {
    const rows = await q<LeaderView>(
      "SELECT id, name, title, bio, linkedin_url, photo_id, photo_url FROM leaders WHERE is_active = true ORDER BY sort_order ASC, created_at ASC"
    );
    if (rows.length) return rows;
  } catch { /* table missing → fall back to the bundled list */ }
  return LEADERSHIP_FALLBACK.map((p, i) => ({
    id: String(i), name: p.name, title: p.role, bio: p.bio,
    linkedin_url: p.linkedin, photo_id: null, photo_url: "",
  }));
}

export type CaseStudyView = {
  id: string; title: string; client: string; industry: string; challenge: string;
  approach: string; solution: string; technology: string[]; deliveryModel: string;
  outcome: string; quote: string; quoteBy: string; image: string;
};

/** Case studies. Empty until real, client-approved material is added. */
export async function getCaseStudies(): Promise<CaseStudyView[]> {
  try {
    const rows = await q<{
      slug: string; title: string; client: string; industry: string; challenge: string;
      approach: string; solution: string; technology: string; delivery_model: string;
      outcome: string; quote: string; quote_by: string; image_id: string | null; image_url: string;
    }>(
      "SELECT slug, title, client, industry, challenge, approach, solution, technology, delivery_model, outcome, quote, quote_by, image_id, image_url FROM case_studies WHERE is_active = true ORDER BY sort_order ASC, created_at ASC"
    );
    return rows.map((r) => ({
      id: r.slug, title: r.title, client: r.client, industry: r.industry,
      challenge: r.challenge, approach: r.approach, solution: r.solution,
      technology: r.technology.split(",").map((t) => t.trim()).filter(Boolean),
      deliveryModel: r.delivery_model, outcome: r.outcome,
      quote: r.quote, quoteBy: r.quote_by, image: logoSrc(r.image_id, r.image_url),
    }));
  } catch { return []; }
}

export type TestimonialView = {
  quote: string; person: string; title: string; organization: string; context: string; logo: string;
};

/** Testimonials by kind — 'client' or 'candidate'. Empty until supplied. */
export async function getTestimonials(kind: "client" | "candidate"): Promise<TestimonialView[]> {
  try {
    const rows = await q<{
      quote: string; person: string; title: string; organization: string;
      context: string; logo_id: string | null; logo_url: string;
    }>(
      "SELECT quote, person, title, organization, context, logo_id, logo_url FROM testimonials WHERE is_active = true AND kind = $1 ORDER BY sort_order ASC, created_at ASC",
      [kind]
    );
    return rows.map((r) => ({
      quote: r.quote, person: r.person, title: r.title,
      organization: r.organization, context: r.context, logo: logoSrc(r.logo_id, r.logo_url),
    }));
  } catch { return []; }
}

/** Simple key/value copy (About Us etc.), with defaults. */
export async function getCopy(defaults: Record<string, string>): Promise<Record<string, string>> {
  const out = { ...defaults };
  try {
    const rows = await q<{ key: string; value: string }>("SELECT key, value FROM content");
    for (const r of rows) if (r.key in out || true) out[r.key] = r.value;
  } catch { /* ignore */ }
  return out;
}
