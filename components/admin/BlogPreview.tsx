"use client";

import { useEffect, useState } from "react";
import BlogArticle, { HERO_IMAGE } from "@/components/BlogArticle";
import FocalDrag from "@/components/admin/FocalDrag";
import { joinImage, splitImage, type BlogPost, type BlogSection } from "@/lib/blog";
import { DraftBadge, NoDraft, sendDraftPatch, useDraft, type Draft } from "@/components/admin/preview";


function parse<T>(raw: unknown, fallback: T): { value: T; bad: boolean } {
  try {
    const v = JSON.parse(String(raw || "null"));
    return { value: Array.isArray(v) ? (v as T) : fallback, bad: v != null && !Array.isArray(v) };
  } catch {
    return { value: fallback, bad: true };
  }
}

/** The editor's form values, shaped the way the page receives a stored post. */
function toPost(d: Draft): { post: BlogPost; problems: string[] } {
  const picture = splitImage(String(d.image_url || ""));
  const sections = parse<BlogSection[]>(d.sections_json, []);
  const takeaways = parse<string[]>(d.takeaways_json, []);
  const problems: string[] = [];
  if (sections.bad) problems.push("Body (JSON) is not valid, so the body is not shown.");
  if (takeaways.bad) problems.push("In short (JSON) is not valid, so it is not shown.");
  return {
    problems,
    post: {
      slug: "preview",
      tag: String(d.tag || "Technology"),
      title: String(d.title || "Untitled post"),
      excerpt: String(d.excerpt || ""),
      image: picture.src || "/insights/platform.jpg",
      imageAlt: String(d.image_alt || ""),
      imagePos: picture.pos,
      date: String(d.published_at || new Date().toISOString().slice(0, 10)),
      author: { name: String(d.author_name || ""), role: String(d.author_role || "") },
      accent: Number(d.accent) || 0,
      intro: String(d.intro || ""),
      sections: sections.value,
      takeaways: takeaways.value,
    },
  };
}

/**
 * Renders the draft the blog editor is holding, in the real article template.
 * The editor writes its form to localStorage on every change and this tab
 * listens for it, so the preview follows the typing without a save.
 *
 * The lead picture can be dragged here, in the frame it will sit in. That is
 * handed back to the editor, which is where it gets saved.
 */
export default function BlogPreview({ more }: { more: BlogPost[] }) {
  const draft = useDraft("blog");
  const stored = String(draft?.image_url || "");
  /* Where the picture was just dragged to. It covers the moment before the
     editor echoes the change back, then gives way to whatever the editor says. */
  const [moved, setMoved] = useState<string | null>(null);
  useEffect(() => { setMoved(null); }, [stored]);

  if (draft === undefined) return <div className="min-h-screen" />;
  if (draft === null) return <NoDraft where="a post under Site content → Blog" />;

  const { post, problems } = toPost({ ...draft, image_url: moved ?? stored });
  const at = splitImage(moved ?? stored);
  return (
    <>
      <BlogArticle
        post={post}
        more={more}
        hero={at.src ? (
          <FocalDrag
            src={at.src}
            alt={post.imageAlt}
            x={at.x}
            y={at.y}
            className={HERO_IMAGE}
            onChange={(x, y) => {
              const next = joinImage(at.src, x, y);
              setMoved(next);
              sendDraftPatch("blog", { image_url: next });
            }}
          />
        ) : undefined}
      />
      <DraftBadge problems={problems} publish={{ kind: "blog", live: draft.is_active !== false }} />
    </>
  );
}
