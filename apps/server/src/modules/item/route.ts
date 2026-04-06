import { ItemSchemas } from "@workspace/contracts/item";
import { isNull } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { itemRepo } from "./repo";
import { items } from "./schema";
import { updateItem } from "./service/update";

export const itemRouter = {
  // list: protectedProcedure
  //   .input(ItemSchemas.list.request)
  //   .output(ItemSchemas.list.response)
  //   .handler(async ({ input }) => listItem(input)),

  // get: protectedProcedure
  //   .input(ItemSchemas.get.request)
  //   .output(ItemSchemas.get.response)
  //   .errors({ NOT_FOUND: { message: "Item not found" } })
  //   .handler(async ({ input: { id }, errors }) => {
  //     const item = await getItem(id);
  //     if (!item) throw errors.NOT_FOUND();
  //     return item;
  //   }),

  update: updateItem,

  delete: protectedProcedure
    .input(ItemSchemas.delete.request)
    .output(ItemSchemas.delete.response)
    .errors({ NOT_FOUND: { message: "Item not found" } })
    .handler(async ({ input: { id, hard }, errors }) => {
      const item = await itemRepo.findById(id);
      if (!item) throw errors.NOT_FOUND();

      if (hard) {
        await itemRepo.delete(id);
        return;
      }

      await itemRepo.update(id, { deletedAt: new Date() });
    }),

  deleteAll: protectedProcedure
    .input(ItemSchemas.deleteAll.request)
    .output(ItemSchemas.deleteAll.response)
    .handler(async ({ input: { hard } }) => {
      if (hard) {
        await db.delete(items);
        return;
      }

      await db.update(items).set({ deletedAt: new Date() }).where(isNull(items.deletedAt));
    }),
};
