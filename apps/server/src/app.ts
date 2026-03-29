import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./config/env";
import { auth } from "./core/auth/lib";
import { apiRouterHandler } from "./routers/api";
import { rpcRouterHandler } from "./routers/rpc";

const app = new Hono();

// Middleware
app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// auth handler
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// oRPC handler
app.use("/rpc/*", rpcRouterHandler);
app.use("/api/*", apiRouterHandler);

// Root route
app.get("/", (c) => c.text("OK"));

export default app;
