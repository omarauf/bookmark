import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { onError } from "@orpc/server";
import { CORSPlugin, ResponseHeadersPlugin } from "@orpc/server/plugins";
import type { Context as HonoContext } from "hono";
import { createContext } from "@/lib/context";
import { appRouter } from "./common";

const handler = new OpenAPIHandler(appRouter, {
  plugins: [new CORSPlugin(), new ResponseHeadersPlugin()],
  interceptors: [
    onError((error) => {
      if (error instanceof Error) {
        console.error(`API Error: ${error.message}`);
        if (process.env.NODE_ENV === "development" && error.stack) {
          console.error(error.stack);
        }
      } else {
        console.error("API Error:", String(error));
      }
    }),
  ],
});

export const apiRouterHandler = async (c: HonoContext, next: () => Promise<void>) => {
  const context = await createContext({ context: c });

  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: "/api",
    context: context,
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }
  await next();
};
