import "server-only";
import { q } from "@/lib/db";
import { PARTNERS as PARTNERS_FALLBACK, LOCATIONS, PRACTICES as PRACTICES_FALLBACK, PRACTICE_LOGOS, STAFFING as STAFFING_FALLBACK, AWARDS as AWARDS_FALLBACK } from "@/lib/data";

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
      { name: "line", type: "text" },
      { name: "body", type: "text" },
      { name: "points", type: "text" },
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

export type StaffingView = { id: string; name: string; line: string; body: string; points: string[] };

export async function getStaffing(): Promise<StaffingView[]> {
  try {
    const rows = await q<{ slug: string; name: string; line: string; body: string; points: string }>(
      "SELECT slug, name, line, body, points FROM staffing WHERE is_active = true ORDER BY sort_order ASC, created_at ASC"
    );
    if (rows.length) {
      return rows.map((r) => ({
        id: r.slug,
        name: r.name,
        line: r.line,
        body: r.body,
        points: r.points.split("\n").map((s) => s.replace(/^[-*•]\s*/, "").trim()).filter(Boolean),
      }));
    }
  } catch { /* fallback */ }
  return STAFFING_FALLBACK.map((s) => ({
    id: s.id, name: s.name, line: s.line, body: s.body, points: [...s.points],
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

/** Simple key/value copy (About Us etc.), with defaults. */
export async function getCopy(defaults: Record<string, string>): Promise<Record<string, string>> {
  const out = { ...defaults };
  try {
    const rows = await q<{ key: string; value: string }>("SELECT key, value FROM content");
    for (const r of rows) if (r.key in out || true) out[r.key] = r.value;
  } catch { /* ignore */ }
  return out;
}
