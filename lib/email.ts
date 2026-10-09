import nodemailer, { type Transporter } from "nodemailer";
import { existsSync, readFileSync, statSync } from "fs";
import { join, normalize, sep } from "path";
import { announcementHtml } from "@/lib/email-shell";
import { mailBaseUrl } from "@/lib/email-templates";

/**
 * SMTP email via Nodemailer.
 *
 * Production: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.
 * No SMTP config: falls back to Nodemailer's JSON transport (composes the
 * message but does not send) so the app never crashes and the flow is testable.
 */

export type SendResult = {
  ok: boolean;
  mode: "smtp" | "json";
  accepted: string[];
  messageId?: string;
  preview?: string; // raw composed message when in json mode
  error?: string;
};

let cached: { transporter: Transporter; mode: "smtp" | "json" } | null = null;

function getTransport() {
  if (cached) return cached;
  const host = process.env.SMTP_HOST;
  if (host) {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
    cached = { transporter, mode: "smtp" };
  } else {
    // Test/dev: compose but don't send.
    const transporter = nodemailer.createTransport({ jsonTransport: true });
    cached = { transporter, mode: "json" };
  }
  return cached;
}

export type MailAttachment = { filename: string; content: Buffer | string; contentType?: string; encoding?: string; cid?: string };

/**
 * Pictures from the site's own /public folder travel inside the email.
 *
 * A template addresses them as <site>/insights/platform.jpg, and a mail client
 * fetches that address when the mail is opened. That only works if the site is
 * live at exactly that address: from a development machine, or before the
 * domain points at the deployment, every picture arrives broken. Attached and
 * referenced by content id, the picture is part of the message and shows
 * wherever it was sent from.
 *
 * Where the file cannot be read (a host that serves /public from a CDN and does
 * not ship it with the server code), the address is left as it was, which on
 * such a host is the live site and loads normally.
 */
function inlineSiteImages(html: string): { html: string; images: MailAttachment[] } {
  const base = mailBaseUrl();
  const root = join(process.cwd(), "public");
  const images: MailAttachment[] = [];
  const cids = new Map<string, string>();
  const out = html.replace(/src="([^"]+\.(?:png|jpe?g|gif|webp))"/gi, (whole, src: string) => {
    if (!src.startsWith(`${base}/`)) return whole;
    const rel = decodeURIComponent(src.slice(base.length));
    const file = normalize(join(root, rel));
    /* Nothing outside /public, whatever the template says. */
    if (!file.startsWith(root + sep)) return whole;
    try {
      if (!existsSync(file) || statSync(file).size > 1024 * 1024) return whole;
      let cid = cids.get(file);
      if (!cid) {
        cid = `img${cids.size + 1}@site`;
        cids.set(file, cid);
        images.push({ filename: rel.split("/").pop() || "image", content: readFileSync(file), cid });
      }
      return `src="cid:${cid}"`;
    } catch {
      return whole;
    }
  });
  return { html: out, images };
}

export async function sendMail(opts: {
  to: string[];
  cc?: string[];
  /** Passing this (even empty) switches to explicit addressing: `to` is shown
      as To, `cc` as Cc, and only these are hidden. Without it, more than one
      `to` address is sent as a blind-copy blast, as before. */
  bcc?: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: MailAttachment[];
}): Promise<SendResult> {
  const { transporter, mode } = getTransport();
  const from = process.env.SMTP_FROM || "Testsoft <noreply@testsoft.com>";
  const cc = opts.cc ?? [];

  const explicit = opts.bcc !== undefined;
  const bcc = opts.bcc ?? [];

  if (!opts.to.length && !cc.length && !bcc.length) {
    return { ok: false, mode, accepted: [], error: "No recipients." };
  }

  try {
    // One recipient → normal To. Many → BCC blast (To = the from address).
    const inlined = opts.html ? inlineSiteImages(opts.html) : null;
    const single = opts.to.length === 1 && !cc.length;
    const envelopeFrom = process.env.SMTP_USER || from;
    const everyone = [...new Set([...opts.to, ...cc, ...bcc])];
    const info = await transporter.sendMail({
      from,                                   // visible From: no-reply@testsoft.com
      sender: envelopeFrom,                   // actual authenticated sender (Gmail)
      envelope: { from: envelopeFrom, to: everyone },
      replyTo: opts.replyTo || process.env.SMTP_REPLY_TO || from,
      /* A message with only hidden recipients still needs a To line, so it is
         addressed to the sender. */
      to: explicit ? (opts.to.length ? opts.to : from) : single ? opts.to[0] : from,
      cc: cc.length ? cc : undefined,
      bcc: explicit ? (bcc.length ? bcc : undefined) : single ? undefined : opts.to,
      subject: opts.subject,
      text: opts.text,
      html: inlined?.html,
      attachments: inlined ? [...inlined.images, ...(opts.attachments ?? [])] : opts.attachments,
    });

    if (mode === "json") {
      return {
        ok: true,
        mode,
        accepted: explicit ? everyone : opts.to,
        messageId: info.messageId,
        preview: typeof info.message === "string" ? info.message : JSON.stringify(info),
      };
    }
    return {
      ok: true,
      mode,
      accepted: (info.accepted as string[]) ?? (explicit ? everyone : opts.to),
      messageId: info.messageId,
    };
  } catch (e) {
    return { ok: false, mode, accepted: [], error: e instanceof Error ? e.message : "Send failed." };
  }
}

/** The address mail goes out as, for the admin to see before sending. */
export function mailFrom(): string {
  return process.env.SMTP_FROM || "Testsoft <noreply@testsoft.com>";
}

/** Splits a list into the addresses that are well formed and those that are not. */
export function sortAddresses(input: unknown): { ok: string[]; bad: string[] } {
  const list = Array.isArray(input) ? input : typeof input === "string" ? input.split(/[,;\s]+/) : [];
  const ok: string[] = [];
  const bad: string[] = [];
  for (const raw of list) {
    const e = String(raw).trim().toLowerCase();
    if (!e) continue;
    (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? ok : bad).push(e);
  }
  return { ok: [...new Set(ok)], bad };
}

/** Builds the generic onboarding announcement. */
export function onboardingEmail(emp: {
  name: string;
  title?: string | null;
  department?: string | null;
  location?: string | null;
  startDate?: string | null;
}) {
  const role = [emp.title, emp.department].filter(Boolean).join(", ");
  const subject = `Please welcome ${emp.name} to Testsoft`;
  const lines = [
    `Hi team,`,
    ``,
    `Please join us in welcoming ${emp.name}${role ? `, joining as ${role}` : ""}${
      emp.location ? ` (${emp.location})` : ""
    }${emp.startDate ? `, starting ${emp.startDate}` : ""}.`,
    ``,
    `We're excited to have ${emp.name.split(" ")[0]} on board. Say hello when you get the chance!`,
    ``,
    `— Testsoft People Team`,
  ];
  const text = lines.join("\n");
  /* Built from the text, so the two cannot disagree and an edited message can
     be re-wrapped the same way. */
  const html = announcementHtml(text);
  return { subject, text, html };
}
