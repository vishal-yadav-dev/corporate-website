import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import LegalBody from "@/components/LegalBody";
import { getLegal } from "@/lib/site";
import { formatDate } from "@/lib/blog";

/**
 * The shell for the policy pages: privacy, terms, SMS and cookies.
 *
 * The text comes from the database when the client has edited it in
 * /admin/legal, and from the defaults in lib/legal.ts when they have not. The
 * policies themselves promise a "Last Updated" date, so one is shown as soon
 * as there is an edit to date it from.
 */
export default async function LegalPage({ slug }: { slug: string }) {
  const doc = await getLegal(slug);
  if (!doc) notFound();

  return (
    <>
      <PageHeader eyebrow="Legal" title={doc.title} />
      <div className="relative z-10 bg-paper pb-16 sm:pb-24">
        <div className="mx-auto max-w-[53.75rem] px-5 sm:px-8">
          {doc.updatedAt && (
            <p className="mono-label text-graphite mb-8">
              Last updated <time dateTime={doc.updatedAt}>{formatDate(doc.updatedAt.slice(0, 10))}</time>
            </p>
          )}
          <LegalBody body={doc.body} />
        </div>
      </div>
    </>
  );
}
