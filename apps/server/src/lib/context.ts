import type { ResponseHeadersPluginContext } from "@orpc/server/plugins";
import type { Context as HonoContext } from "hono";
import { auth } from "../core/auth/lib";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({ headers: context.req.raw.headers });

  return { session };
}

export type Context = Awaited<ReturnType<typeof createContext>> & ResponseHeadersPluginContext;
