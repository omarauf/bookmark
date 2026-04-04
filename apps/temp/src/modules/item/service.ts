import { and, eq, inArray, or } from "drizzle-orm";
import { v7 as uuidV7 } from "uuid";
import type { CreateItem } from "@/contracts/item";
import type { CreateItemRelation } from "@/contracts/item-relation";
import { db } from "@/core/db";
import { itemRelations, items } from "./schema";

/**
 * Deduplicates items by `${platform}:${externalId}`.
 * Keeps the first occurrence of each unique key.
 */
function deduplicateItems(inputItems: CreateItem[]) {
  return Array.from(
    new Map(inputItems.map((item) => [`${item.platform}:${item.externalId}`, item])).values(),
  );
}

/**
 * Deduplicates relations by `${fromExternalId}:${toExternalId}:${relationType}`.
 * Keeps the first occurrence of each unique key.
 */
function deduplicateRelations(inputRelations: CreateItemRelation[]) {
  return Array.from(
    new Map(
      inputRelations.map((relation) => [
        `${relation.fromExternalId}:${relation.toExternalId}:${relation.relationType}`,
        relation,
      ]),
    ).values(),
  );
}

/**
 * Queries the database for items that match the given external IDs.
 */
async function getExistingItems(externalIds: string[]) {
  if (externalIds.length === 0) return [];
  return db
    .select({ id: items.id, externalId: items.externalId, platform: items.platform })
    .from(items)
    .where(inArray(items.externalId, externalIds));
}

/**
 * Filters out items that already exist in the database.
 */
function filterNewItems(
  uniqueItems: CreateItem[],
  existingItems: Awaited<ReturnType<typeof getExistingItems>>,
) {
  const existingSet = new Set(existingItems.map((item) => `${item.platform}:${item.externalId}`));
  return uniqueItems.filter((item) => !existingSet.has(`${item.platform}:${item.externalId}`));
}

/**
 * Prepares new items for database insertion with UUID v7 IDs.
 */
function prepareItemsForInsert(newItems: CreateItem[]) {
  return newItems.map((item) => ({
    id: uuidV7(),
    platform: item.platform,
    kind: item.kind,
    externalId: item.externalId,
    url: item.url,
    caption: item.caption,
    createdAt: item.createdAt,
    metadata: item.metadata,
  }));
}

/**
 * Builds a mapping from external IDs to internal UUIDs.
 * Combines both existing and newly created items.
 */
function buildExternalIdMap(
  existingItems: Awaited<ReturnType<typeof getExistingItems>>,
  newItems: ReturnType<typeof prepareItemsForInsert>,
) {
  const map = new Map<string, string>();

  for (const item of existingItems) {
    map.set(item.externalId, item.id);
  }

  for (const item of newItems) {
    map.set(item.externalId, item.id);
  }

  return map;
}

/**
 * Converts relation endpoints from external IDs to internal UUIDs.
 * Skips relations where either endpoint cannot be resolved.
 */
function mapRelationsToInternalIds(
  uniqueRelations: CreateItemRelation[],
  externalIdMap: Map<string, string>,
) {
  return uniqueRelations
    .map((relation) => {
      const fromItemId = externalIdMap.get(relation.fromExternalId);
      const toItemId = externalIdMap.get(relation.toExternalId);

      if (!fromItemId || !toItemId) {
        return null;
      }

      return {
        fromItemId,
        toItemId,
        relationType: relation.relationType,
        x: relation.x ?? 0,
        y: relation.y ?? 0,
        createdAt: relation.createdAt,
      };
    })
    .filter((relation): relation is NonNullable<typeof relation> => relation !== null);
}

/**
 * Deduplicates mapped relations by `${fromItemId}:${toItemId}:${relationType}`.
 */
function deduplicateMappedRelations(mappedRelations: ReturnType<typeof mapRelationsToInternalIds>) {
  return Array.from(
    new Map(
      mappedRelations.map((relation) => [
        `${relation.fromItemId}:${relation.toItemId}:${relation.relationType}`,
        relation,
      ]),
    ).values(),
  );
}

/**
 * Queries the database for relations that already exist.
 */
async function getExistingRelations(
  uniqueMappedRelations: ReturnType<typeof deduplicateMappedRelations>,
) {
  if (uniqueMappedRelations.length === 0) return [];

  return db
    .select({
      fromItemId: itemRelations.fromItemId,
      toItemId: itemRelations.toItemId,
      relationType: itemRelations.relationType,
    })
    .from(itemRelations)
    .where(
      or(
        ...uniqueMappedRelations.map((relation) =>
          and(
            eq(itemRelations.fromItemId, relation.fromItemId),
            eq(itemRelations.toItemId, relation.toItemId),
            eq(itemRelations.relationType, relation.relationType),
          ),
        ),
      ),
    );
}

/**
 * Filters out relations that already exist in the database.
 */
function filterNewRelations(
  uniqueMappedRelations: ReturnType<typeof deduplicateMappedRelations>,
  existingRelations: Awaited<ReturnType<typeof getExistingRelations>>,
) {
  const existingRelationSet = new Set(
    existingRelations.map(
      (relation) => `${relation.fromItemId}:${relation.toItemId}:${relation.relationType}`,
    ),
  );

  return uniqueMappedRelations.filter(
    (relation) =>
      !existingRelationSet.has(
        `${relation.fromItemId}:${relation.toItemId}:${relation.relationType}`,
      ),
  );
}

/**
 * Imports items and relations from external payloads into internal DB tables.
 *
 * Behavior:
 * - Deduplicates input items by `${platform}:${externalId}`.
 * - Deduplicates input relations by `${fromExternalId}:${toExternalId}:${relationType}`.
 * - Skips items that already exist in the database.
 * - Generates UUID v7 IDs for new items and maps external IDs to internal IDs.
 * - Converts relation endpoints from external IDs to internal UUIDs.
 * - Skips unresolved relations and existing relation rows.
 * - Uses a transaction to ensure atomic inserts.
 */
export async function importItems(
  createdItems: CreateItem[],
  createdRelations: CreateItemRelation[],
) {
  // Step 1: Deduplicate input data
  const uniqueItems = deduplicateItems(createdItems);
  const uniqueRelations = deduplicateRelations(createdRelations);

  // Step 2: Query existing items and filter new ones
  const existingItems = await getExistingItems(uniqueItems.map((item) => item.externalId));
  const newItems = filterNewItems(uniqueItems, existingItems);

  // Step 3: Prepare new items for insertion
  const preparedNewItems = prepareItemsForInsert(newItems);

  // Step 4: Build external ID to internal UUID mapping
  const externalIdMap = buildExternalIdMap(existingItems, preparedNewItems);

  // Step 5: Map relations to internal IDs and deduplicate
  const mappedRelations = mapRelationsToInternalIds(uniqueRelations, externalIdMap);
  const uniqueMappedRelations = deduplicateMappedRelations(mappedRelations);

  // Step 6: Query existing relations and filter new ones
  const existingRelations = await getExistingRelations(uniqueMappedRelations);
  const relationsToInsert = filterNewRelations(uniqueMappedRelations, existingRelations);

  // Step 7: Insert in transaction
  await db.transaction(async (tx) => {
    if (preparedNewItems.length > 0) {
      await tx.insert(items).values(preparedNewItems);
    }

    if (relationsToInsert.length > 0) {
      await tx.insert(itemRelations).values(relationsToInsert);
    }
  });
}
