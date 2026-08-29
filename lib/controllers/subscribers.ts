import { handler, json, body, auth, params } from "@/lib/http";
import * as svc from "@/lib/services/subscribers";

const out = (r: unknown) => (r instanceof Response ? r : json(r));

export const subscribe = handler(async (req) => json(await svc.subscribe(await body(req))));

export const list = handler(async (req) => {
  await auth("subscribers");
  return out(await svc.list(new URL(req.url).searchParams));
});

export const remove = handler(async (_req, ctx) => {
  await auth("subscribers");
  const { id } = await params<{ id: string }>(ctx);
  return json(await svc.remove(id));
});
