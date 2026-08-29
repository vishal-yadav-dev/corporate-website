"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type Job = {
  id: string;
  title: string;
  slug: string;
  practice: string | null;
  location: string | null;
  employment_type: string;
  workplace: string;
  summary: string;
};

export default function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filters = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((j) => j.practice).filter(Boolean) as string[]))],
    [jobs]
  );
  const shown = active === "All" ? jobs : jobs.filter((j) => j.practice === active);

  if (loading) {
    return <p className="text-graphite">Loading open roles…</p>;
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-paper border border-line rounded-2xl p-10 text-center text-graphite">
        No open roles right now. Send your CV to <a href="/contact" className="text-brand hover:underline">our team</a> and we&apos;ll reach out when something fits.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button key={f} onClick={() => setActive(f)}
            className={`mono-label px-4 py-2 rounded-full border transition-colors ${active === f ? "bg-brand text-white border-brand" : "text-graphite border-line-blue hover:border-brand hover:text-brand"}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-px bg-line border border-line rounded-2xl overflow-hidden">
        <AnimatePresence mode="popLayout">
          {shown.map((job) => (
            <motion.div key={job.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Link href={`/careers/${job.slug}`} className="group grid md:grid-cols-[1fr_auto] gap-4 md:items-center bg-paper hover:bg-paper-tint px-6 sm:px-10 py-7 transition-colors">
                <div>
                  <h3 className="display text-2xl sm:text-3xl text-ink group-hover:text-brand transition-colors">{job.title}</h3>
                  <p className="mt-1 text-sm text-graphite">
                    {[job.location, job.workplace, job.employment_type].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {job.practice && <span className="mono-label text-graphite border border-line-blue rounded-full px-3 py-1.5">{job.practice}</span>}
                  <span className="text-brand/40 group-hover:text-brand group-hover:translate-x-1 transition-all">Apply →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
