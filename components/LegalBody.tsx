import Link from "next/link";
import { parseInline, parseLegal } from "@/lib/legal";

/**
 * A policy body, rendered from its plain-text source.
 *
 * No directive at the top on purpose: the public pages render this on the
 * server and the admin editor renders it in the browser as you type, so the
 * preview is the page rather than an approximation of it.
 */
function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((run, i) => {
        if (run.href) {
          const cls = "text-brand underline underline-offset-4 hover:text-brand-deep";
          return run.href.startsWith("/") ? (
            <Link key={i} href={run.href} className={cls}>{run.text}</Link>
          ) : (
            <a key={i} href={run.href} className={cls}>{run.text}</a>
          );
        }
        if (run.bold) return <strong key={i} className="font-semibold text-ink">{run.text}</strong>;
        return <span key={i}>{run.text}</span>;
      })}
    </>
  );
}

export default function LegalBody({ body }: { body: string }) {
  return (
    <div className="text-lg text-ink/80 leading-[1.8]">
      {parseLegal(body).map((b, i) =>
        b.type === "h2" ? (
          <h2 key={i} className="display text-2xl sm:text-3xl text-ink leading-tight mt-12 mb-4 first:mt-0">{b.text}</h2>
        ) : b.type === "ul" ? (
          <ul key={i} className="mt-4 list-disc pl-6 marker:text-brand">
            {b.items.map((item, j) => (
              <li key={j} className="mt-2"><Inline text={item} /></li>
            ))}
          </ul>
        ) : (
          <p key={i} className="mt-4 first:mt-0 whitespace-pre-line"><Inline text={b.text} /></p>
        )
      )}
    </div>
  );
}
