import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "./config/env";
import { apiRouterHandler } from "./routers/api";
import { orpcRouterHandler } from "./routers/rpc";

const app = new Hono();

// Middleware
// app.use(logger());
app.use(
  "/*",
  cors({ origin: env.CORS_ORIGIN.split(","), allowMethods: ["GET", "POST", "OPTIONS"] }),
);

// oRPC handler
app.use("/rpc/*", orpcRouterHandler);
app.use("/api/*", apiRouterHandler);

// Root route
app.get("/", (c) => c.text("OK"));

export default app;
