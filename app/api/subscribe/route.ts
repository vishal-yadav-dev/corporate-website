import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { cuid } from "@/lib/id";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true });
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!isEmail(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 422 });

  try {
    await q(
      `INSERT INTO subscribers (id, email, status) VALUES ($1,$2,'active')
       ON CONFLICT (email) DO UPDATE SET status = 'active'`,
      [cuid(), email]
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not subscribe. Try again." }, { status: 500 });
  }
}
