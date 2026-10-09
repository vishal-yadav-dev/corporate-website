import { handler, json, body, auth } from "@/lib/http";
import { getNotifySettings, saveNotifySettings } from "@/lib/services/form-mail";

/* Who is emailed when a form on the site is submitted. */
export const GET = handler(async () => {
  await auth("email");
  return json({ forms: await getNotifySettings() });
});

export const PUT = handler(async (req) => {
  await auth("email");
  return json(await saveNotifySettings(await body(req)));
});
