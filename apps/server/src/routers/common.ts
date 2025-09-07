import type { RouterClient } from "@orpc/server";
import { features } from "@/features";
import { publicProcedure } from "@/lib/orpc";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  ...features,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
