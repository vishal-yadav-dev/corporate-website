import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import BlogList, { type BlogCard } from "@/components/BlogList";
import FeaturedBlogCard from "@/components/FeaturedBlogCard";
import { formatDate, readMinutes, getCategoryForTag } from "@/lib/blog";
import { getBlogPosts } from "@/lib/site";
import { PRISM_VAR } from "@/lib/data";

/* ISR: rendered once and reused for a minute, so a click is not waiting
   on a database round trip. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Testsoft's perspectives on the technologies, industries, and trends shaping organizations — enterprise platforms, modernization, and the public sector.",
};

export default async function BlogIndexPage() {
  /* Newest first, so the order does not depend on how the array is typed. */
  const posts = [...(await getBlogPosts())].sort((a, b) => b.date.localeCompare(a.date));
  const [lead] = posts;

  /* Reduced to what a card prints before it crosses to the browser. The bodies
     are the bulk of a post and the index never shows them. */
  /* Every post, including the featured one. The heading below says everything
     we have published, and a reader looking for a specific piece should not
     have to notice that one of them is only at the top of the page. */
  const cards: BlogCard[] = posts.map((p) => ({
    slug: p.slug,
    tag: p.tag,
    category: getCategoryForTag(p.tag, p.category),
    title: p.title,
    excerpt: p.excerpt,
    image: p.image,
    imageAlt: p.imageAlt,
    imagePos: p.imagePos,
    date: p.date,
    dateLabel: formatDate(p.date),
    minutes: readMinutes(p),
    accent: p.accent,
  }));

  return (
    <div style={{ "--page-accent": PRISM_VAR[2] } as React.CSSProperties}>
      <PageHeader
        eyebrow="Blogs"
        ink
        title="Ideas shaping technology, business, and the future of work."
        intro="Testsoft's perspectives on the technologies, industries, and trends shaping organizations."
      />

      {/* Modern 3D Glass Featured Article Card */}
      {lead && (
        <section className="relative z-10 bg-paper py-14 sm:py-20 border-b border-line">
          <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
            <Reveal variant="rise" duration={0.8}>
              <FeaturedBlogCard
                post={{
                  slug: lead.slug,
                  tag: lead.tag,
                  category: getCategoryForTag(lead.tag, lead.category),
                  title: lead.title,
                  excerpt: lead.excerpt,
                  image: lead.image,
                  imageAlt: lead.imageAlt,
                  imagePos: lead.imagePos,
                  date: lead.date,
                  dateLabel: formatDate(lead.date),
                  minutes: readMinutes(lead),
                  author: lead.author,
                  accent: lead.accent,
                }}
              />
            </Reveal>
          </div>
        </section>
      )}

      <section className="relative z-10 bg-paper py-14 sm:py-18">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-10">
            <p className="mono-label label-accent mb-4">All articles</p>
            <h2 className="display text-3xl sm:text-5xl text-ink">
              Everything we have{" "}
              <span className="italic" style={{ color: "var(--page-accent)" }}>published.</span>
            </h2>
          </Reveal>

          <BlogList items={cards} />
        </div>
      </section>

      <CtaBanner
        eyebrow="Blogs"
        heading="Working on something we have written about?"
        body="If one of these describes where you are, we are happy to talk it through without a pitch attached."
        cta="Talk to an Expert"
      />
    </div>
  );
}
