import type { SessionPayload } from "@/lib/auth";

/**
 * Admin sections. `icon` is a key into components/admin/Icon.tsx.
 * Editors can be granted any of these except "dashboard" (everyone gets that).
 */
export const SECTIONS = [
  { key: "dashboard", label: "Dashboard", href: "/admin", exact: true, icon: "grid" },
  { key: "leads", label: "Enquiries", href: "/admin/leads", icon: "inbox" },
  { key: "employees", label: "Employees", href: "/admin/employees", icon: "users" },
  { key: "leadership", label: "Leadership team", href: "/admin/leadership", icon: "star" },
  { key: "jobs", label: "Job openings", href: "/admin/jobs", icon: "briefcase" },
  { key: "applications", label: "Job applications", href: "/admin/applications", icon: "doc" },
  { key: "subscribers", label: "Newsletter subscribers", href: "/admin/subscribers", icon: "mail" },
  { key: "email", label: "Email & campaigns", href: "/admin/email", icon: "send" },
  { key: "images", label: "Media library", href: "/admin/images", icon: "image" },
  { key: "banners", label: "Homepage banners", href: "/admin/banners", icon: "layout" },
  { key: "site", label: "Site content", href: "/admin/site", icon: "globe" },
  { key: "content", label: "Homepage text", href: "/admin/content", icon: "text" },
  { key: "team", label: "Users & access", href: "/admin/team", icon: "shield" },
] as const;

export type SectionKey = (typeof SECTIONS)[number]["key"];

export const ALL_SECTION_KEYS = SECTIONS.map((s) => s.key);

/** Owners and admins have full access; editors are limited to their granted list. */
export function canAccess(
  who: { role?: string; perms?: string[] } | null | undefined,
  key: string
): boolean {
  if (!who) return false;
  if (who.role === "owner" || who.role === "admin") return true;
  if (who.role === "editor") return key === "dashboard" || (who.perms ?? []).includes(key);
  return false;
}

export function parsePerms(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") {
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Section key for an admin route path (most specific match). */
export function sectionForPath(pathname: string): string | null {
  let match: { key: string; len: number } | null = null;
  for (const s of SECTIONS) {
    if (s.href === "/admin" ? pathname === "/admin" : pathname.startsWith(s.href)) {
      if (!match || s.href.length > match.len) match = { key: s.key, len: s.href.length };
    }
  }
  return match?.key ?? null;
}

export type Who = Pick<SessionPayload, "role"> & { perms?: string[] };
