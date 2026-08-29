"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Data = { me: { name: string; email: string; role: string }; stats: { leads: number; newLeads: number; subs: number; images: number; employees: number; openJobs: number; newApplications: number } };

export default function Dashboard() {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => { fetch("/api/admin/me").then((r) => r.json()).then(setData).catch(() => {}); }, []);

  const cards = [
    { label: "Total leads", value: data?.stats.leads, sub: `${data?.stats.newLeads ?? 0} new`, href: "/admin/leads" },
    { label: "Open jobs", value: data?.stats.openJobs, sub: "published", href: "/admin/jobs" },
    { label: "Applications", value: data?.stats.newApplications, sub: "new to review", href: "/admin/applications" },
    { label: "Employees", value: data?.stats.employees, sub: "active", href: "/admin/employees" },
    { label: "Subscribers", value: data?.stats.subs, sub: "newsletter", href: "/admin/subscribers" },
    { label: "Images", value: data?.stats.images, sub: "in library", href: "/admin/images" },
  ];

  return (
    <div>
      <p className="mono-label text-accent-deep mb-2">Dashboard</p>
      <h1 className="display text-4xl sm:text-5xl text-ink">Welcome back{data ? `, ${data.me.name.split(" ")[0]}` : ""}.</h1>
      <p className="mt-3 text-graphite">Here&apos;s what&apos;s happening across the Noblesoft site.</p>

      <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-surface border border-line rounded-2xl p-6 hover:border-brand transition-colors">
            <p className="display text-4xl sm:text-5xl text-brand">{c.value ?? "—"}</p>
            <p className="mt-2 text-sm text-ink font-medium">{c.label}</p>
            <p className="text-xs text-graphite">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <Link href="/admin/employees" className="bg-brand text-white rounded-2xl p-6 hover:bg-brand-deep transition-colors">
          <h3 className="display text-xl">Onboard an employee</h3>
          <p className="mt-1 text-sm text-white/70">Add a new hire and send the welcome announcement.</p>
        </Link>
        <Link href="/admin/content" className="bg-surface border border-line rounded-2xl p-6 hover:border-brand transition-colors">
          <h3 className="display text-xl text-ink">Edit site content</h3>
          <p className="mt-1 text-sm text-graphite">Update hero copy, images, and section text.</p>
        </Link>
      </div>
    </div>
  );
}
