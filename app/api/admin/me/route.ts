import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guard";
import { one } from "@/lib/db";
import { ALL_SECTION_KEYS, canAccess } from "@/lib/permissions";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  const who = { role: guard.role, perms: guard.perms };
  const allowed = ALL_SECTION_KEYS.filter((k) => canAccess(who, k));
  const n = async (sql: string) => Number((await one<{ n: string }>(sql))?.n ?? 0);
  const [leads, newLeads, subs, images, employees, openJobs, newApplications] = await Promise.all([
    n("SELECT COUNT(*)::int AS n FROM leads"),
    n("SELECT COUNT(*)::int AS n FROM leads WHERE status = 'new'"),
    n("SELECT COUNT(*)::int AS n FROM subscribers WHERE status = 'active'"),
    n("SELECT COUNT(*)::int AS n FROM site_images"),
    n("SELECT COUNT(*)::int AS n FROM employees WHERE status = 'active'"),
    n("SELECT COUNT(*)::int AS n FROM jobs WHERE status = 'published'"),
    n("SELECT COUNT(*)::int AS n FROM applications WHERE status = 'new'"),
  ]);
  return NextResponse.json({
    me: { email: guard.email, name: guard.name, role: guard.role, perms: guard.perms ?? [], allowed },
    stats: { leads, newLeads, subs, images, employees, openJobs, newApplications },
  });
}
