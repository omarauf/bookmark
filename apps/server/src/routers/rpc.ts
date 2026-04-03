import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import type { Context as HonoContext } from "hono";
import { createContext } from "@/lib/context";
import { appRouter } from "./common";

const handler = new RPCHandler(appRouter, {
  plugins: [],
  interceptors: [
    onError((error) => {
      if (error instanceof Error) {
        console.error(`RPC Error: ${error.message}`);
        if (process.env.NODE_ENV === "development" && error.stack) {
          console.error(error.stack);
        }
      } else {
        console.error("RPC Error:", String(error));
      }
    }),
  ],
});

export const rpcRouterHandler = async (c: HonoContext, next: () => Promise<void>) => {
  const context = await createContext({ context: c });
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: "/rpc",
    context: context,
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
};
