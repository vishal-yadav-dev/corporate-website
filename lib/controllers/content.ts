import { handler, json, body, auth } from "@/lib/http";
import * as svc from "@/lib/services/content";

/** Public — cached key/value copy map. */
export const publicMap = handler(async () =>
  json(await svc.map(), { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" } })
);

export const list = handler(async () => {
  await auth("content");
  return json(await svc.list());
});

export const save = handler(async (req) => {
  await auth("content");
  return json(await svc.save(await body(req)));
});
