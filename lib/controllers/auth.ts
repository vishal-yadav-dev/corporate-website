import { handler, json, body, auth } from "@/lib/http";
import * as svc from "@/lib/services/auth";

export const login = handler(async (req) => {
  const b = await body<{ email: string; password: string }>(req);
  return json(await svc.login(b.email, b.password));
});

export const logout = handler(async () => json(await svc.logout()));

export const forgotPassword = handler(async (req) => {
  const b = await body<{ email: string }>(req);
  return json(await svc.requestReset(b.email));
});

export const checkToken = handler(async (req) => {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  return json(await svc.checkToken(token));
});

export const setPassword = handler(async (req) => {
  const b = await body<{ token: string; password: string }>(req);
  return json(await svc.setPassword(b.token, b.password));
});

/** Signed-in admin asks for their own reset link. */
export const resetMyPassword = handler(async () => {
  const me = await auth();
  return json(await svc.issueToken(me.sub, "reset"));
});
