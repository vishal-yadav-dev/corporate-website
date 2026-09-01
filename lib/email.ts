import nodemailer, { type Transporter } from "nodemailer";

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

export type MailAttachment = { filename: string; content: Buffer | string; contentType?: string; encoding?: string };

export async function sendMail(opts: {
  to: string[];
  cc?: string[];
  subject: string;
  text: string;
  html?: string;
  attachments?: MailAttachment[];
}): Promise<SendResult> {
  const { transporter, mode } = getTransport();
  const from = process.env.SMTP_FROM || "Testsoft <no-reply@testsoft.com>";
  const cc = opts.cc ?? [];

  if (!opts.to.length && !cc.length) {
    return { ok: false, mode, accepted: [], error: "No recipients." };
  }

  try {
    // One recipient → normal To. Many → BCC blast (To = the from address).
    const single = opts.to.length === 1 && !cc.length;
    const envelopeFrom = process.env.SMTP_USER || from;
    const info = await transporter.sendMail({
      from,                                   // visible From: no-reply@testsoft.com
      sender: envelopeFrom,                   // actual authenticated sender (Gmail)
      envelope: { from: envelopeFrom, to: [...opts.to, ...cc] },
      replyTo: process.env.SMTP_REPLY_TO || from,
      to: single ? opts.to[0] : from,
      cc: cc.length ? cc : undefined,
      bcc: single ? undefined : opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      attachments: opts.attachments,
    });

    if (mode === "json") {
      return {
        ok: true,
        mode,
        accepted: opts.to,
        messageId: info.messageId,
        preview: typeof info.message === "string" ? info.message : JSON.stringify(info),
      };
    }
    return {
      ok: true,
      mode,
      accepted: (info.accepted as string[]) ?? opts.to,
      messageId: info.messageId,
    };
  } catch (e) {
    return { ok: false, mode, accepted: [], error: e instanceof Error ? e.message : "Send failed." };
  }
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
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#14161C">
      <div style="background:#0B3D91;padding:24px 28px;border-radius:12px 12px 0 0">
        <span style="color:#fff;font-size:20px;font-weight:700">Testsoft</span>
      </div>
      <div style="border:1px solid #E4E2DB;border-top:none;border-radius:0 0 12px 12px;padding:28px">
        <p style="margin:0 0 14px">Hi team,</p>
        <p style="margin:0 0 14px">Please join us in welcoming
          <strong>${emp.name}</strong>${role ? `, joining as ${role}` : ""}${
    emp.location ? ` <span style="color:#5B6472">(${emp.location})</span>` : ""
  }${emp.startDate ? `, starting ${emp.startDate}` : ""}.</p>
        <p style="margin:0 0 14px">We're excited to have ${emp.name.split(" ")[0]} on board.
          Say hello when you get the chance!</p>
        <p style="margin:18px 0 0;color:#5B6472">— Testsoft People Team</p>
      </div>
    </div>`;
  return { subject, text, html };
}
