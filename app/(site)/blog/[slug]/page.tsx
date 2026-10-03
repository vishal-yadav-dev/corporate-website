import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import ShareLinks from "@/components/ShareLinks";
import { formatDate, postUrl, readMinutes } from "@/lib/blog";
import { getBlogPost, getBlogPosts } from "@/lib/site";
import { PRISM_VAR } from "@/lib/data";

/* ISR: rendered once and reused for a minute, so a click is not waiting
   on a database round trip. */
export const revalidate = 60;

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

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

  const accent = PRISM_VAR[post.accent % 6];
  const more = (await getBlogPosts()).filter((p) => p.slug !== post.slug).slice(0, 2);

  const fullArticleContent = `${post.title}\n\n${post.excerpt}\n\n${post.intro}\n\n` +
    post.sections.map((s) => `${s.heading ? `${s.heading}\n` : ""}${s.paras?.join("\n\n") || ""}`).join("\n\n");

  return (
    <article style={{ "--page-accent": accent } as React.CSSProperties}>
      {/* Full-width, high-impact hero header across max-w-[1400px] */}
      <header className="relative z-10 overflow-hidden bg-paper pt-32 sm:pt-40 pb-16 sm:pb-20 border-b border-line/60">
        {/* Subtle ambient accent glow behind headline */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/3 h-[420px] w-[700px] rounded-full opacity-20 blur-[130px]"
          style={{ background: accent }}
        />

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mono-label text-graphite mb-7 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <Link href="/blog" className="hover:text-brand transition-colors">Blogs</Link>
              <span aria-hidden>/</span>
              <span className="label-accent">{post.tag}</span>
            </nav>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="flex items-center gap-3">
              <span className={`inline-block rounded-full px-4 py-1.5 mono-label text-xs text-white font-medium shadow-sm ${PRISM_BG[post.accent % 6]}`}>
                {post.tag}
              </span>
              <span className="mono-label text-xs text-graphite/70">
                {readMinutes(post)} min read
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="display mt-6 text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-ink leading-[1.02] font-extrabold tracking-tight max-w-6xl">
              {post.title}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-8 text-xl sm:text-3xl text-ink/85 leading-relaxed font-normal max-w-5xl">
              {post.excerpt}
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line/70 pt-8 max-w-5xl">
              <span
                aria-hidden
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${PRISM_BG[post.accent % 6]} text-white display text-base font-bold shadow-md`}
              >
                {post.author.name.split(" ").map((w) => w[0]).join("")}
              </span>
              <div>
                <p className="text-base font-bold text-ink leading-tight">{post.author.name}</p>
                <p className="text-xs text-graphite/80 mt-0.5">{post.author.role}</p>
              </div>
              <div className="sm:ml-auto mono-label text-xs text-graphite/80 flex items-center gap-2">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="relative z-10 bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-10">
          <Reveal variant="rise" duration={0.8}>
            <figure className="relative overflow-hidden rounded-[28px] border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.imageAlt}
                className="media-footage block aspect-[21/9] sm:aspect-[2.4/1] w-full object-cover"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px]"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent 70%)` }}
              />
            </figure>
          </Reveal>
        </div>
      </div>

      {/* Body. Held to a comfortable measure for reading. */}
      <div className="relative z-10 bg-paper py-14 sm:py-18">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <Reveal>
            <p className="text-xl sm:text-2xl text-ink/85 leading-[1.7]">{post.intro}</p>
          </Reveal>

          {post.sections.map((s, i) => (
            <Reveal key={s.heading ?? i} delay={0.04}>
              <section className="mt-12">
                {s.heading && (
                  <h2 className="display text-2xl sm:text-3xl text-ink leading-tight">
                    {s.heading}
                    <span aria-hidden className="prism-rule mt-4 block" style={{ background: accent }} />
                  </h2>
                )}
                {s.paras?.map((para, j) => (
                  <p key={j} className="mt-5 text-lg text-ink/80 leading-[1.85]">{para}</p>
                ))}
                {s.list && (
                  <ul className="mt-6 space-y-4">
                    {s.list.map((li) => (
                      <li key={li} className="flex gap-4 text-lg text-ink/80 leading-[1.8]">
                        <span aria-hidden className="mt-[0.75em] h-px w-5 shrink-0" style={{ background: accent }} />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}

          {/* What a reader takes away if they read nothing else. */}
          <Reveal>
            <aside className="relative mt-14 overflow-hidden rounded-[24px] border border-line bg-surface p-8 sm:p-10">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-[0.16] blur-[90px]"
                style={{ background: accent }}
              />
              <p className="relative mono-label label-accent mb-5">In short</p>
              <ul className="relative space-y-4">
                {post.takeaways.map((t) => (
                  <li key={t} className="flex gap-4 text-ink/80 leading-relaxed">
                    <span aria-hidden className="mt-[0.7em] h-px w-5 shrink-0" style={{ background: accent }} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>

          <Reveal>
            <div className="mt-12 border-t border-line pt-8">
              <ShareLinks title={post.title} url={postUrl(post.slug)} bodyText={fullArticleContent} />
            </div>
          </Reveal>
        </div>
      </div>

      {/* Keep reading */}
      <section className="relative z-10 bg-surface py-14 sm:py-18 border-t border-line">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="mono-label label-accent mb-4">Keep reading</p>
              <h2 className="display text-3xl sm:text-5xl text-ink">
                More from the{" "}
                <span className="italic" style={{ color: accent }}>blog.</span>
              </h2>
            </div>
            <Link href="/blog" className="mono-label label-accent hover:text-brand transition-colors">
              Explore all blogs →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {more.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06} variant="rise">
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-paper transition-all duration-500 hover:-translate-y-1 hover:border-[var(--card-accent)]/50 hover:shadow-card"
                  style={{ "--card-accent": PRISM_VAR[p.accent % 6] } as React.CSSProperties}
                >
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="media-footage block aspect-[16/10] w-full object-cover transition-transform duration-[1.1s] group-hover:scale-[1.06]"
                    />
                    <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 mono-label text-white ${PRISM_BG[p.accent % 6]}`}>
                      {p.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="display text-xl sm:text-2xl text-ink leading-tight transition-colors group-hover:text-[var(--card-accent)]">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm text-graphite leading-relaxed">{p.excerpt}</p>
                    <p className="mt-5 mono-label text-graphite/80">
                      <time dateTime={p.date}>{formatDate(p.date)}</time> · {readMinutes(p)} min read
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow={post.tag}
        heading="Working on this right now?"
        body="If this describes where you are, we are happy to talk it through without a pitch attached."
        cta="Talk to an Expert"
      />
    </article>
  );
}
