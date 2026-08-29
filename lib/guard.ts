import { getSession, type SessionPayload } from "@/lib/auth";
import { canAccess } from "@/lib/permissions";

/**
 * Ensures the caller is signed in. Pass a `section` key to also enforce that
 * the caller's role/permissions grant access to that admin area.
 */
export async function requireAdmin(section?: string): Promise<SessionPayload | Response> {
  const session = await getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (section && !canAccess({ role: session.role, perms: session.perms }, section)) {
    return new Response(JSON.stringify({ error: "You don't have access to this area." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return session;
}
