"use client";

import Wordmark from "@/components/Wordmark";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/permissions";
import Icon from "@/components/admin/Icon";

const WIDE = ["/admin/email", "/admin/legal", "/admin/pages"];

export default function AdminSidebar({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState<string[] | null>(null);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => { setAllowed(d.me?.allowed ?? null); setRole(d.me?.role ?? ""); })
      .catch(() => {});
  }, []);

  const links = SECTIONS.filter((s) => !allowed || allowed.includes(s.key));

  /* Screens with a side-by-side preview open with the menu folded to icons, so
     the work has the width. The button overrides that either way, and the
     choice lasts until you move to another section. */
  const wide = WIDE.some((p) => pathname.startsWith(p));
  const [choice, setChoice] = useState<{ path: string; rail: boolean } | null>(null);
  const rail = choice?.path === pathname ? choice.rail : wide;
  useEffect(() => {
    document.documentElement.dataset.adminNav = rail ? "rail" : "open";
    return () => { delete document.documentElement.dataset.adminNav; };
  }, [rail]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className={`w-full ${rail ? "lg:w-[68px]" : "lg:w-[260px]"} lg:min-h-screen border-b lg:border-b-0 lg:border-r border-line bg-surface/90 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 flex lg:flex-col z-20 transition-[width] duration-200`}>
      <div className={`p-5 ${rail ? "lg:px-3 lg:py-6" : "lg:p-6"} flex flex-col gap-4 w-full`}>
        {/* Mobile: the brand gets its own row so the section links below get the
            full width instead of a ~130px strip. Desktop is unchanged. */}
        <div className="flex items-center justify-between gap-4">
          {/* In the rail only the monogram fits; the name is the second span. */}
          <Link href="/admin" className={`flex items-center gap-2 shrink-0 ${rail ? "lg:mx-auto lg:[&>span:last-child]:hidden" : ""}`}>
            <Wordmark size="sm" mono />
          </Link>
          {!rail && (
            <button
              onClick={() => setChoice({ path: pathname, rail: true })}
              aria-label="Collapse menu"
              title="Collapse menu"
              className="hidden lg:grid h-8 w-8 place-items-center rounded-lg text-graphite hover:bg-paper-tint hover:text-brand"
            >
              «
            </button>
          )}
          <div className="flex items-center gap-3 lg:hidden">
            <Link href="/" className="text-xs text-graphite hover:text-brand whitespace-nowrap">View site →</Link>
            <button onClick={logout} className="text-xs text-accent-deep whitespace-nowrap">Sign out</button>
          </div>
        </div>

        {rail && (
          <button
            onClick={() => setChoice({ path: pathname, rail: false })}
            aria-label="Expand menu"
            title="Expand menu"
            className="hidden lg:grid h-9 w-full place-items-center rounded-lg text-graphite hover:bg-paper-tint hover:text-brand"
          >
            »
          </button>
        )}

        <nav className={`flex lg:flex-col gap-1 ${rail ? "lg:mt-0" : "lg:mt-6"} flex-1 min-w-0 overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0`}>
          {links.map((l) => {
            const active = l.href === "/admin" ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                title={rail ? l.label : undefined}
                className={`flex items-center gap-2.5 whitespace-nowrap px-3 py-2 rounded-lg text-sm transition-colors ${
                  rail ? "lg:justify-center lg:px-0 lg:py-2.5" : ""
                } ${active ? "bg-brand text-white" : "text-ink/70 hover:bg-paper-tint hover:text-brand"}`}
              >
                <Icon name={l.icon} className="h-4 w-4 shrink-0" />
                <span className={rail ? "lg:hidden" : ""}>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={`hidden ${rail ? "" : "lg:block"} lg:mt-auto pt-4 border-t border-line`}>
          <p className="text-xs text-graphite mb-1">Signed in as</p>
          <p className="text-sm text-ink font-medium truncate">{name}</p>
          {role && <p className="text-[10px] uppercase tracking-wider text-accent-deep mt-0.5">{role}</p>}
          <button onClick={logout} className="mt-3 text-xs text-accent-deep hover:underline">Sign out</button>
          <Link href="/" className="mt-2 block text-xs text-graphite hover:text-brand">View site →</Link>
        </div>
      </div>
    </aside>
  );
}
