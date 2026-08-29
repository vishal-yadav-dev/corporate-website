import { handler, json, body, auth, params } from "@/lib/http";
import * as svc from "@/lib/services/leads";

const out = (r: unknown) => (r instanceof Response ? r : json(r));

/** Public — contact / enquiry form. */
export const submit = handler(async (req) => json(await svc.submit(await body(req))));

export const list = handler(async (req) => {
  await auth("leads");
  return out(await svc.list(new URL(req.url).searchParams));
});

export const setStatus = handler(async (req, ctx) => {
  await auth("leads");
  const { id } = await params<{ id: string }>(ctx);
  const b = await body<{ status: string }>(req);
  return json(await svc.setStatus(id, String(b.status ?? "")));
});

export const remove = handler(async (_req, ctx) => {
  await auth("leads");
  const { id } = await params<{ id: string }>(ctx);
  return json(await svc.remove(id));
});
