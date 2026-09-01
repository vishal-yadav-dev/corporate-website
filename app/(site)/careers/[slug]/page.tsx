import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import ApplyForm from "@/components/ApplyForm";
import { one } from "@/lib/db";
import { toBullets, type Job } from "@/lib/jobs";

async function getJob(slug: string) {
  return one<Job>("SELECT * FROM jobs WHERE slug = $1 AND status = 'published'", [slug]);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: "Role not found" };
  return {
    title: job.title,
    description: job.summary || `Apply for ${job.title} at Testsoft Technologies.`,
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();

  const meta = [
    ["Location", job.location],
    ["Workplace", job.workplace],
    ["Employment", job.employment_type],
    ["Experience", job.experience],
    ["Practice", job.practice],
    ["Salary", job.salary_range],
  ].filter(([, v]) => v) as [string, string][];

  const Section = ({ title, body }: { title: string; body: string }) => {
    const bullets = toBullets(body);
    if (!bullets.length) return null;
    return (
      <div className="mt-10">
        <h2 className="display text-2xl text-ink mb-4">{title}</h2>
        <ul className="space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-graphite leading-relaxed">
              <span className="text-brand mt-1">—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <section className="relative pt-[140px] sm:pt-[170px] pb-12 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 right-0 h-[360px] w-[360px] rounded-full bg-brand/8 blur-[120px]" />
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 relative z-10">
          <Reveal>
            <Link href="/careers" className="mono-label text-accent-deep hover:text-brand">← All roles</Link>
            <h1 className="display text-ink text-5xl sm:text-7xl max-w-4xl mt-6">{job.title}</h1>
            <p className="mt-5 text-graphite">{[job.location, job.workplace, job.employment_type].filter(Boolean).join(" · ")}</p>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 pb-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-20">
          <div>
            {job.summary && <p className="text-xl text-ink leading-relaxed">{job.summary}</p>}
            {job.description && (
              <p className="mt-6 text-graphite leading-relaxed whitespace-pre-wrap">{job.description}</p>
            )}
            <Section title="What you'll do" body={job.responsibilities} />
            <Section title="What you bring" body={job.requirements} />
            <Section title="What we offer" body={job.benefits} />

            <div id="apply" className="mt-14 border-t border-line pt-10 scroll-mt-28">
              <p className="mono-label text-accent-deep mb-4">Apply now</p>
              <h2 className="display text-3xl text-ink mb-6">Tell us about you.</h2>
              <ApplyForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 self-start">
            <div className="bg-surface border border-line rounded-2xl p-6 surface-card">
              <p className="mono-label text-graphite mb-4">Role details</p>
              <dl className="space-y-3">
                {meta.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 text-sm">
                    <dt className="text-graphite">{k}</dt>
                    <dd className="text-ink font-medium text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <a href="#apply" className="mt-6 block text-center bg-brand text-white px-6 py-3 rounded-full font-medium hover:bg-brand-deep transition-colors">
                Apply for this role
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
