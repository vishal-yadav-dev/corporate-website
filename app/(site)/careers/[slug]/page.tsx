import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobArticle from "@/components/JobArticle";
import { one } from "@/lib/db";
import type { Job } from "@/lib/jobs";

/* ISR: rendered once and reused for a minute, so a click is not waiting
   on a database round trip. */
export const revalidate = 60;

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

  return <JobArticle job={job} />;
}
