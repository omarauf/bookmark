import type { ResponseHeadersPluginContext } from "@orpc/server/plugins";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext(_props: CreateContextOptions) {
  // No auth configured
  return {
    session: null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>> & ResponseHeadersPluginContext;
