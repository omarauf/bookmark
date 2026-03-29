import { CreatorSchemas } from "@workspace/contracts/creator";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { creators } from "../creator/schema";
import { creatorRepo } from "./repo";

export const creatorRouter = {
  delete: protectedProcedure
    .input(CreatorSchemas.delete.request)
    .output(CreatorSchemas.delete.response)
    .errors({ NOT_FOUND: { message: "Creator not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const creator = await creatorRepo.findById(id);
      if (!creator) throw errors.NOT_FOUND();

      await creatorRepo.delete(id);
    }),

  deleteAll: protectedProcedure.output(CreatorSchemas.deleteAll.response).handler(async () => {
    await db.delete(creators);
  }),
};
