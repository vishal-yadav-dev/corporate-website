import { handler, json, body, auth, params } from "@/lib/http";
import * as svc from "@/lib/services/email-templates";

export const list = handler(async () => {
  await auth("email");
  return json(await svc.list());
});

export const save = handler(async (req, ctx) => {
  await auth("email");
  const { slug } = await params<{ slug: string }>(ctx);
  return json(await svc.save(slug, await body(req)));
});

export const reset = handler(async (_req, ctx) => {
  await auth("email");
  const { slug } = await params<{ slug: string }>(ctx);
  return json(await svc.reset(slug));
});
