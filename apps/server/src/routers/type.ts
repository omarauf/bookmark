import type { RouterClient } from "@orpc/server";
import type { appRouter } from "./common";

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<AppRouter>;
