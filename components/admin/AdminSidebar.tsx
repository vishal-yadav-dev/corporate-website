"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/permissions";
import Icon from "@/components/admin/Icon";

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

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-full lg:w-[260px] lg:min-h-screen border-b lg:border-b-0 lg:border-r border-line bg-surface/90 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 flex lg:flex-col z-20">
      <div className="p-5 lg:p-6 flex lg:flex-col gap-4 w-full">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="h-8 w-8 grid place-items-center bg-brand text-white font-display font-bold rounded-[6px]">N</span>
          <span className="display text-lg text-ink">Noblesoft</span>
        </Link>

        <nav className="flex lg:flex-col gap-1 lg:mt-6 flex-1 overflow-x-auto">
          {links.map((l) => {
            const active = l.href === "/admin" ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-2.5 whitespace-nowrap px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? "bg-brand text-white" : "text-ink/70 hover:bg-paper-tint hover:text-brand"
                }`}
              >
                <Icon name={l.icon} className="h-4 w-4 shrink-0" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block lg:mt-auto pt-4 border-t border-line">
          <p className="text-xs text-graphite mb-1">Signed in as</p>
          <p className="text-sm text-ink font-medium truncate">{name}</p>
          {role && <p className="text-[10px] uppercase tracking-wider text-accent-deep mt-0.5">{role}</p>}
          <button onClick={logout} className="mt-3 text-xs text-accent-deep hover:underline">Sign out</button>
          <Link href="/" className="mt-2 block text-xs text-graphite hover:text-brand">View site →</Link>
        </div>

        <button onClick={logout} className="lg:hidden text-xs text-accent-deep whitespace-nowrap self-center">Sign out</button>
      </div>
    </aside>
  );
}
