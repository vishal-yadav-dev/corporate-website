import { NextResponse } from "next/server";
import { getSession, type SessionPayload } from "@/lib/auth";
import { canAccess } from "@/lib/permissions";

/*
 * Small HTTP toolkit shared by every controller.
 *
 * Architecture: route.ts files are thin adapters that re-export controller
 * functions. Controllers (lib/controllers) handle HTTP concerns - auth, input
 * parsing, status codes. Services (lib/services) hold the business logic and
 * throw HttpError for anything the client did wrong.
 */

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const bad = (msg: string) => new HttpError(422, msg);
export const unauthorized = (msg = "Unauthorized") => new HttpError(401, msg);
export const forbidden = (msg = "You don't have access to this.") => new HttpError(403, msg);
export const notFound = (msg = "Not found.") => new HttpError(404, msg);
export const conflict = (msg: string) => new HttpError(409, msg);

export function json(data: unknown, init?: number | ResponseInit) {
  const opts = typeof init === "number" ? { status: init } : init;
  return NextResponse.json(data as object, opts);
}

/** Wrap a controller body so thrown HttpErrors become clean JSON responses. */
export function handler<Ctx = unknown>(
  fn: (req: Request, ctx: Ctx) => Promise<Response> | Response
) {
  return async (req: Request, ctx: Ctx): Promise<Response> => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, e.status);
      console.error("[api] unhandled error:", e);
      return json({ error: "Something went wrong. Please try again." }, 500);
    }
  };
}

export type Session = SessionPayload;

/** Require a signed-in admin; optionally require access to a section. */
export async function auth(section?: string): Promise<Session> {
  const session = await getSession();
  if (!session) throw unauthorized();
  if (section && !canAccess({ role: session.role, perms: session.perms }, section)) {
    throw forbidden("You don't have access to this area.");
  }
  return session;
}

export async function body<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new HttpError(400, "Invalid request body.");
  }
}

export async function form(req: Request): Promise<FormData> {
  try {
    return await req.formData();
  } catch {
    throw new HttpError(400, "Invalid form upload.");
  }
}

/** Resolve Next.js dynamic route params from a controller ctx. */
export async function params<T extends Record<string, string>>(ctx: unknown): Promise<T> {
  const c = ctx as { params?: Promise<T> | T };
  return (c?.params ? await c.params : {}) as T;
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export function toCsv(header: string[], rows: unknown[][], filename: string) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [header.join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}-${Date.now()}.csv"`,
    },
  });
}
