import { ItemSchemas } from "@workspace/contracts/item";
import { and, eq, notInArray } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { collectionRepo } from "@/modules/collection/repo";
import { collectionItems } from "@/modules/collection/schema";
import { filterForDeepestPaths } from "@/modules/collection/utils";
import { itemTags } from "@/modules/tag/schema";
import { itemRepo } from "../repo";
import { items } from "../schema";

export const updateItem = protectedProcedure
  .input(ItemSchemas.update.request)
  .output(ItemSchemas.update.response)
  .errors({ NOT_FOUND: { message: "Item not found" } })
  .handler(async ({ input: { id, collectionIds, tagIds, ...rest }, errors }) => {
    const itemId = id;
    const item = await itemRepo.findById(itemId);

    if (!item) throw errors.NOT_FOUND();

    const collections = await collectionRepo.findByIds(collectionIds);

    const filteredCollections = filterForDeepestPaths(collections);

    const newCollectionIds = filteredCollections.map((c) => c.id);

    await db.transaction(async (tx) => {
      // Update item properties
      await tx.update(items).set(rest).where(eq(items.id, itemId));

      // Remove item from collections that are no longer associated
      await tx
        .delete(collectionItems)
        .where(
          and(
            eq(collectionItems.itemId, itemId),
            notInArray(collectionItems.collectionId, newCollectionIds),
          ),
        );

      // Add item to new collections
      if (newCollectionIds.length > 0) {
        await tx
          .insert(collectionItems)
          .values(newCollectionIds.map((collectionId) => ({ collectionId, itemId })))
          .onConflictDoNothing();
      }

      // Remove tags that are no longer associated
      await tx
        .delete(itemTags)
        .where(and(eq(itemTags.itemId, itemId), notInArray(itemTags.tagId, tagIds)));

      // Add item to new tags
      if (tagIds.length > 0) {
        await tx
          .insert(itemTags)
          .values(tagIds.map((tagId) => ({ tagId, itemId })))
          .onConflictDoNothing();
      }
    });
  });
