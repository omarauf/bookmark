import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { type Context, onError } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import type { StandardHandlerPlugin } from "@orpc/server/standard";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import type { Context as HonoContext } from "hono";
import { env } from "@/config/env";
import { createContext } from "@/lib/context";
import { appRouter } from "./common";

const plugins: StandardHandlerPlugin<Context>[] = [new CORSPlugin()];

if (env.NODE_ENV === "development") {
  plugins.push(
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: "Ilancom Api",
          version: "1.0.0",
        },
        servers: [
          // or let the plugin auto-infer from the request
          { url: "http://localhost:3000/api" },
        ],
        security: [{ bearerAuth: [] }],
        components: {
          securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" } },
        },
      },
    }),
  );
}

const handler = new OpenAPIHandler(appRouter, {
  plugins,
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
