/** Shared helpers for job vacancies + candidate applications. */

export const CV_MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export const CV_ALLOWED_MIME = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

export const EMPLOYMENT_TYPES = ["Full-time", "Contract", "Part-time", "Internship"] as const;
export const WORKPLACES = ["On-site", "Hybrid", "Remote"] as const;
export const JOB_STATUSES = ["draft", "published", "closed"] as const;
export const APPLICATION_STATUSES = [
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "archived",
] as const;

export type Job = {
  id: string;
  title: string;
  slug: string;
  practice: string | null;
  location: string | null;
  employment_type: string;
  workplace: string;
  experience: string | null;
  salary_range: string | null;
  summary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  status: string;
  post_linkedin: boolean;
  post_naukri: boolean;
  linkedin_posted_at: string | null;
  naukri_posted_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "role";
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.testsoft.com").replace(/\/+$/, "");
}

export function jobPublicUrl(slug: string): string {
  return `${siteUrl()}/careers/${slug}`;
}

/** LinkedIn share composer, prefilled with the job URL. */
export function linkedinShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

/** Splits a textarea value ("one bullet per line") into a clean list. */
export function toBullets(text: string | null | undefined): string[] {
  return (text || "")
    .split("\n")
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

/** Plain-text job post, ready to paste into Naukri (or anywhere without an API). */
export function jobPostText(job: Job): string {
  const url = jobPublicUrl(job.slug);
  const meta = [job.location, job.workplace, job.employment_type, job.experience]
    .filter(Boolean)
    .join(" · ");
  const section = (heading: string, body: string) => {
    const bullets = toBullets(body);
    if (!bullets.length) return "";
    return `\n${heading}\n${bullets.map((b) => `• ${b}`).join("\n")}\n`;
  };

  return [
    `${job.title} — Testsoft Technologies`,
    meta,
    "",
    job.summary,
    job.description ? `\n${job.description}` : "",
    section("Responsibilities", job.responsibilities),
    section("Requirements", job.requirements),
    section("What we offer", job.benefits),
    `\nApply here: ${url}`,
    `#hiring #${(job.practice || "tech").replace(/\s+/g, "")} #careers`,
  ]
    .filter((l) => l !== "")
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
