import { oo } from "@orpc/openapi";
import { ORPCError, os } from "@orpc/server";
import type { Context } from "./context";

const o = os.$context<Context>().$config({
  initialOutputValidationIndex: Number.NaN,
});

export const publicProcedure = o.errors({
  UNAUTHORIZED: oo.spec(
    { message: "You must be logged in to access this resource." },
    { security: [{ bearerAuth: [] }] },
  ),
});

const authMiddleware = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "You must be logged in to access this resource.",
    });
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

export const protectedProcedure = publicProcedure.use(authMiddleware);
