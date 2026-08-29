import { handler, json, body } from "@/lib/http";
import * as chat from "@/lib/services/chat";

/** Public — the website chat widget. No auth. */
export const ask = handler(async (req) => {
  return json(await chat.ask(await body(req)));
});
