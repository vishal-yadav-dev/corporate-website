"use client";

import Hero from "@/components/Hero";
import JobArticle, { type JobView } from "@/components/JobArticle";
import Leadership from "@/components/Leadership";
import { DraftBadge, NoDraft, useDraft, type Draft } from "@/components/admin/preview";

/* Each of these shapes an editor's form the way the public component receives
   a stored row, then renders that component. No template is copied here. */

const str = (v: unknown) => String(v ?? "");

export function JobPreview() {
  const d = useDraft("job");
  if (d === undefined) return <div className="min-h-screen" />;
  if (d === null) return <NoDraft where="a role under Job openings" />;

  const job: JobView = {
    id: "preview",
    title: str(d.title) || "Untitled role",
    practice: str(d.practice) || null,
    location: str(d.location) || null,
    employment_type: str(d.employment_type),
    workplace: str(d.workplace),
    experience: str(d.experience) || null,
    salary_range: str(d.salary_range) || null,
    summary: str(d.summary),
    description: str(d.description),
    responsibilities: str(d.responsibilities),
    requirements: str(d.requirements),
    benefits: str(d.benefits),
  };
  return (
    <>
      <JobArticle job={job} preview />
      <DraftBadge />
    </>
  );
}

export function BannerPreview() {
  const d = useDraft("banner");
  if (d === undefined) return <div className="min-h-screen" />;
  if (d === null) return <NoDraft where="a slide under Homepage banners" />;

  const banner = {
    id: "preview",
    title: str(d.title) || "Your headline here",
    subtitle: str(d.subtitle),
    cta_text: str(d.cta_text),
    cta_url: str(d.cta_url),
    media_id: str(d.media_id) || null,
    sort_order: 0,
    background_fx: str(d.background_fx),
    media_mime_type: null,
    media_alt: null,
  };
  return (
    <>
      {/* The hero keeps its slides in state, so a changed draft remounts it. */}
      <Hero key={JSON.stringify(banner)} initialBanners={[banner]} />
      <DraftBadge />
    </>
  );
}

type LeaderRow = {
  id: string; name: string; title: string; bio: string;
  linkedin_url: string; photo_id: string | null; photo_url: string;
};

function toLeader(d: Draft): LeaderRow {
  return {
    id: str(d.__id) || "preview",
    name: str(d.name) || "New leader",
    title: str(d.title),
    bio: str(d.bio),
    linkedin_url: str(d.linkedin_url),
    photo_id: str(d.photo_id) || null,
    photo_url: str(d.photo_url),
  };
}

export function LeaderPreview({ leaders }: { leaders: LeaderRow[] }) {
  const d = useDraft("leader");
  if (d === undefined) return <div className="min-h-screen" />;
  if (d === null) return <NoDraft where="a person under Leadership team" />;

  /* An edit replaces that person where they stand; a new person joins the end. */
  const draft = toLeader(d);
  const list = leaders.some((l) => l.id === draft.id)
    ? leaders.map((l) => (l.id === draft.id ? draft : l))
    : [...leaders, draft];

  return (
    <>
      <section className="relative z-10 bg-paper-tint/55 pt-40 pb-20">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <div className="mb-10">
            <p className="mono-label text-accent-deep mb-4">Leadership</p>
            <h2 className="display text-5xl sm:text-7xl text-ink max-w-3xl">Meet the leaders behind the work.</h2>
          </div>
          <Leadership key={JSON.stringify(list)} initialLeaders={list} />
        </div>
      </section>
      <DraftBadge />
    </>
  );
}
