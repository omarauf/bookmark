import { os } from "@orpc/server";
import type { Context } from "./context";

const o = os.$context<Context>().$config({
  initialOutputValidationIndex: Number.NaN,
});
export const publicProcedure = o;
