import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CtaBanner from "@/components/CtaBanner";
import BlogArticle from "@/components/BlogArticle";
import { getBlogPost, getBlogPosts } from "@/lib/site";

/* ISR: rendered once and reused for a minute, so a click is not waiting
   on a database round trip. */
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getBlogPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      images: [post.image],
    },
    /* Without this X falls back to a small thumbnail beside the link. */
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.image] },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const more = (await getBlogPosts()).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <BlogArticle post={post} more={more}>
      <CtaBanner
        eyebrow={post.tag}
        heading="Working on this right now?"
        body="If this describes where you are, we are happy to talk it through without a pitch attached."
        cta="Talk to an Expert"
      />
    </BlogArticle>
  );
}
