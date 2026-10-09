/**
 * The plain announcement wrapper: a header band and the message as paragraphs.
 *
 * In its own file with no imports so both sides can use it: the server builds
 * the outgoing mail with it, and the admin's preview renders the same markup in
 * the browser. lib/email.ts pulls in nodemailer and cannot be loaded there.
 */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function announcementHtml(text: string): string {
  const paras = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 14px">${esc(p).replace(/\n/g, "<br/>")}</p>`)
    .join("\n        ");
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#14161C">
      <div style="background:#0B3D91;padding:24px 28px;border-radius:12px 12px 0 0">
        <span style="color:#fff;font-size:20px;font-weight:700">Testsoft</span>
      </div>
      <div style="border:1px solid #E4E2DB;border-top:none;border-radius:0 0 12px 12px;padding:28px">
        ${paras}
      </div>
    </div>`;
}

/* ------------------------------------------------------------------ *
 * Frame and body.
 *
 * A stored template is a whole email: the header band, the message, the
 * footer. Only the message is something an editor should be typing in, so the
 * shell marks where it starts and ends, and the admin edits that part visually
 * while the frame around it stays intact.
 * ------------------------------------------------------------------ */
export const BODY_START = "<!--body:start-->";
export const BODY_END = "<!--body:end-->";

export type Framed = { before: string; body: string; after: string };

/** Null when the template has no markers, i.e. it is a bare message. */
export function splitFrame(html: string): Framed | null {
  const a = html.indexOf(BODY_START);
  const b = html.lastIndexOf(BODY_END);
  if (a < 0 || b < a) return null;
  return { before: html.slice(0, a + BODY_START.length), body: html.slice(a + BODY_START.length, b).trim(), after: html.slice(b) };
}

export function joinFrame(f: Framed, body: string): string {
  return `${f.before}${body}${f.after}`;
}
