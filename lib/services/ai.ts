import { bad, HttpError } from "@/lib/http";

/**
 * "Draft with AI" helper — Gemini free tier, locked to writing emails for
 * Noblesoft only. Anything else gets a fixed refusal. Capped per thread to
 * protect the free quota.
 */

const MODEL = "gemini-1.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const MAX_DRAFTS_PER_THREAD = 5;

const REFUSAL = "I can only draft emails for Noblesoft. Ask me to write or rework an email and I'll help.";

const SYSTEM = `You are an email-writing assistant for Noblesoft Technologies, an enterprise
application consulting company. You ONLY help draft, rewrite, shorten, or adjust the tone of
business emails and their HTML for Noblesoft (recruiting, onboarding, newsletters, client
outreach, notifications).

Rules:
- If the request is anything other than drafting/editing an email, reply with EXACTLY:
  "${REFUSAL}"
- Never write code (except simple inline HTML for the email body), essays, poems, or general answers.
- Keep the brand voice: clear, professional, warm, concise.
- Return ONLY the email. If asked for HTML, return a clean HTML fragment (no <html>/<head>).
  Otherwise return plain text. No preamble, no explanation.`;

// naive in-memory per-thread counter (resets on server restart — fine for a quota guard)
const counts = new Map<string, number>();

export async function draftEmail(input: Record<string, unknown>) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new HttpError(503, "AI drafting isn't configured. Add GEMINI_API_KEY to .env.");

  const prompt = String(input.prompt ?? "").trim();
  const threadId = String(input.threadId ?? "default").slice(0, 64);
  const format = input.format === "html" ? "html" : "text";
  const context = String(input.context ?? "").slice(0, 4000);
  if (prompt.length < 3) throw bad("Tell the assistant what email you need.");

  const used = counts.get(threadId) ?? 0;
  if (used >= MAX_DRAFTS_PER_THREAD) {
    throw new HttpError(429, `You've used all ${MAX_DRAFTS_PER_THREAD} AI drafts for this email. Edit it by hand from here.`);
  }

  const userText = [
    context ? `Current draft / context:\n${context}\n` : "",
    `Request: ${prompt}`,
    `\nReturn the email as ${format === "html" ? "an HTML fragment" : "plain text"}.`,
  ].join("\n");

  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: "user", parts: [{ text: userText }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
      }),
    });
  } catch {
    throw new HttpError(502, "Couldn't reach the AI service. Try again.");
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("gemini error", res.status, detail);
    if (res.status === 429) throw new HttpError(429, "AI free-tier quota reached for now. Try again later.");
    throw new HttpError(502, "The AI service returned an error.");
  }

  const data = await res.json().catch(() => null);
  const text: string =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("").trim() ?? "";
  if (!text) throw new HttpError(502, "The AI returned an empty response.");

  counts.set(threadId, used + 1);
  return {
    draft: text,
    isRefusal: text.trim() === REFUSAL,
    draftsUsed: used + 1,
    draftsLeft: MAX_DRAFTS_PER_THREAD - (used + 1),
  };
}
