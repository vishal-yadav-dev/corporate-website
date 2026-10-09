import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getBlogPosts, getLeaders } from "@/lib/site";
import BlogPreview from "@/components/admin/BlogPreview";
import { BannerPreview, JobPreview, LeaderPreview } from "@/components/admin/DraftPreviews";

export const metadata: Metadata = {
  title: "Draft preview",
  robots: { index: false, follow: false },
};

/**
 * Draft previews for the admin editors: /preview/blog, /job, /banner, /leader.
 *
 * They live under the site layout rather than /admin so a draft is seen with
 * the real header, footer and type scale. That also puts them outside the
 * /admin proxy guard, so the session is checked here. The draft itself never
 * touches the server: the editor tab hands it over through localStorage.
 */
export default async function PreviewPage({ params }: { params: Promise<{ kind: string }> }) {
  if (!(await getSession())) redirect("/admin/login");
  const { kind } = await params;

  if (kind === "blog") return <BlogPreview more={(await getBlogPosts()).slice(0, 2)} />;
  if (kind === "job") return <JobPreview />;
  if (kind === "banner") return <BannerPreview />;
  if (kind === "leader") return <LeaderPreview leaders={await getLeaders()} />;
  notFound();
}
