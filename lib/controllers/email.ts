import { handler, json, body, auth } from "@/lib/http";
import * as newsletter from "@/lib/services/newsletter";
import * as ai from "@/lib/services/ai";

export const history = handler(async () => {
  await auth("email");
  return json(await newsletter.history());
});

export const send = handler(async (req) => {
  await auth("email");
  return json(await newsletter.send(await body(req)));
});

export const draft = handler(async (req) => {
  await auth("email");
  return json(await ai.draftEmail(await body(req)));
});
