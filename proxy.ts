import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { canAccess, sectionForPath } from "@/lib/permissions";

const COOKIE = "ns_session";

async function payload(token: string | undefined): Promise<{ role?: string; perms?: string[] } | null> {
  if (!token) return null;
  const s = process.env.AUTH_SECRET;
  if (!s) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(s));
    return payload as { role?: string; perms?: string[] };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE)?.value;

  const PUBLIC_ADMIN = ["/admin/login", "/admin/forgot-password", "/admin/set-password"];

  // Protect /admin except the auth pages
  if (pathname.startsWith("/admin") && !PUBLIC_ADMIN.includes(pathname)) {
    const p = await payload(token);
    if (!p) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    // Role-based section access
    const section = sectionForPath(pathname);
    if (section && !canAccess(p, section)) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // If already logged in, skip login / forgot (but allow set-password — it carries a token)
  if (pathname === "/admin/login" || pathname === "/admin/forgot-password") {
    const p = await payload(token);
    if (p) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
