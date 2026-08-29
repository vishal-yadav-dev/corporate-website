import { handler, json, body, auth, params } from "@/lib/http";
import * as svc from "@/lib/services/admins";

export const list = handler(async () => {
  await auth("team");
  return json(await svc.list());
});

export const create = handler(async (req) => {
  const me = await auth("team");
  return json(await svc.create(me, await body(req)));
});

export const updateRole = handler(async (req, ctx) => {
  const me = await auth("team");
  const { id } = await params<{ id: string }>(ctx);
  return json(await svc.updateRole(me, id, await body(req)));
});

export const remove = handler(async (_req, ctx) => {
  const me = await auth("team");
  const { id } = await params<{ id: string }>(ctx);
  return json(await svc.remove(me, id));
});

export const resendInvite = handler(async (_req, ctx) => {
  const me = await auth("team");
  const { id } = await params<{ id: string }>(ctx);
  return json(await svc.resendInvite(me, id));
});
