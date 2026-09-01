import { HttpError, bad } from "@/lib/http";
import { getPractices, getOffices } from "@/lib/site";
import { STAFFING, INDUSTRIES } from "@/lib/data";

/**
 * Public website assistant — Gemini free tier, locked to answering questions
 * about Testsoft. Off-topic requests get a fixed redirect. Soft per-caller cap.
 */

const MODEL = "gemini-1.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const MAX_TURNS = 16; // user messages per conversation

const REDIRECT =
  "I can only help with questions about Testsoft — our practices, staff augmentation, industries, careers, and how to get in touch. What would you like to know?";

async function knowledge(): Promise<string> {
  const [practices, offices] = await Promise.all([getPractices(), getOffices()]);
  return [
    "ABOUT: Testsoft Technologies is an Inc. 500 enterprise-application consulting firm and a certified Minority Business Enterprise. Delivery from the US, nearshore Mexico, and offshore India.",
    "",
    "PRACTICES:",
    ...practices.map((p) => `- ${p.name} (${p.tag}): ${p.body}`),
    "",
    "STAFF AUGMENTATION:",
    ...STAFFING.map((s) => `- ${s.name}: ${s.body}`),
    "",
    "INDUSTRIES:",
    ...INDUSTRIES.map((i) => `- ${i.name}: ${i.line}`),
    "",
    "OFFICES:",
    ...offices.map((o) => `- ${o.region} (${o.role}): ${o.address}${o.tel ? ` · ${o.tel}` : ""}`),
    "",
    "CONTACT: Use the contact form at /contact, or the staffing request at /us-staffing. Careers and open roles are at /careers.",
  ].join("\n");
}

const SYSTEM = (kb: string) => `You are the assistant on the Testsoft Technologies website.
Answer ONLY using the facts below. Be concise (2-4 sentences), friendly, and professional.
If someone asks something not about Testsoft (its services, staffing, industries, careers,
offices, or contact), reply with EXACTLY:
"${REDIRECT}"
Never write code, essays, or general knowledge. If a fact isn't below, say you're not sure and
point them to the contact form at /contact.

--- TESTSOFT FACTS ---
${kb}
--- END FACTS ---`;

type Msg = { role: "user" | "model"; text: string };

export async function ask(input: Record<string, unknown>) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new HttpError(503, "The assistant is offline right now — please use the contact form at /contact.");

  const messages: Msg[] = Array.isArray(input.messages)
    ? (input.messages as unknown[])
        .map((m) => {
          const o = m as Record<string, unknown>;
          const role = o.role === "model" ? "model" : "user";
          return { role, text: String(o.text ?? "").slice(0, 2000) } as Msg;
        })
        .filter((m) => m.text)
    : [];

  if (!messages.length) throw bad("Ask a question.");
  if (messages.filter((m) => m.role === "user").length > MAX_TURNS) {
    throw new HttpError(429, "This chat has reached its limit. Please reach out via the contact form at /contact.");
  }

  const kb = await knowledge();

  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM(kb) }] },
        contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
      }),
    });
  } catch {
    throw new HttpError(502, "Couldn't reach the assistant. Try again in a moment.");
  }

  if (!res.ok) {
    if (res.status === 429) throw new HttpError(429, "The assistant is busy right now — try again shortly, or use /contact.");
    throw new HttpError(502, "The assistant hit an error. Please use the contact form at /contact.");
  }

  const data = await res.json().catch(() => null);
  const reply: string =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("").trim() ?? "";
  if (!reply) throw new HttpError(502, "The assistant returned an empty reply.");

  return { reply };
}
