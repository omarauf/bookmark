import { and, eq, isNull, ne, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/core/db";
import { files, folders } from "./schema";

export async function isFolderNameTaken(
  parentId: string | undefined | null,
  name: string,
  excludeId?: string,
): Promise<boolean> {
  const conditions = and(
    eq(folders.name, name),
    excludeId ? ne(folders.id, excludeId) : undefined,
    parentId ? eq(folders.parentId, parentId) : isNull(folders.parentId),
  );

  const [existing] = await db.select({ id: folders.id }).from(folders).where(conditions).limit(1);

  return !!existing;
}

export async function isFileNameTaken(
  folderId: string | undefined | null,
  name: string,
  excludeId?: string,
): Promise<boolean> {
  const conditions = and(
    eq(files.name, name),
    excludeId ? ne(files.id, excludeId) : undefined,
    folderId ? eq(files.folderId, folderId) : isNull(files.folderId),
  );

  const [existing] = await db.select({ id: files.id }).from(files).where(conditions).limit(1);

  return !!existing;
}

export async function collectFolderDescendants(rootId: string) {
  const allFolders = await db.select().from(folders);

  const childrenByParent = new Map<string | null, string[]>();

  for (const folder of allFolders) {
    const key = folder.parentId ?? null;

    const bucket = childrenByParent.get(key) ?? [];
    bucket.push(folder.id);

    childrenByParent.set(key, bucket);
  }

  const result = new Set<string>();
  const stack = [rootId];

  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;
    result.add(current);

    const children = childrenByParent.get(current) ?? [];
    for (const child of children) {
      if (!result.has(child)) stack.push(child);
    }
  }

  return [...result];
}

export async function getFolderDescendants(rootId: string): Promise<Set<string>> {
  const allFolders = await db.select().from(folders);

  const childrenByParent = new Map<string | null, string[]>();

  for (const folder of allFolders) {
    const key = folder.parentId ?? null;

    const bucket = childrenByParent.get(key) ?? [];
    bucket.push(folder.id);

    childrenByParent.set(key, bucket);
  }

  const descendants = new Set<string>();

  const walk = (id: string) => {
    descendants.add(id);
    const children = childrenByParent.get(id) ?? [];
    for (const childId of children) walk(childId);
  };

  walk(rootId);

  return descendants;
}

export async function getFolderBreadcrumb(folderId: string) {
  const parent = alias(folders, "parent");

  const result = await db.execute(sql`
    WITH RECURSIVE breadcrumb AS (
      SELECT ${folders.id}, ${folders.name}, ${folders.parentId}
      FROM ${folders}
      WHERE id = ${folderId}

      UNION ALL

      SELECT ${parent.id}, ${parent.name}, ${parent.parentId}
      FROM ${folders} ${parent}
      INNER JOIN breadcrumb ON ${parent.id} = breadcrumb."parent_id"
    )
    SELECT id as value, name as label
    FROM breadcrumb;
  `);

  // Reverse to get root → leaf order
  return result.rows.reverse() as { value: string; label: string }[];
}
