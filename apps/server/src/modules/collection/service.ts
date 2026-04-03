import { and, arrayContained, eq, sql } from "drizzle-orm";
import { db } from "@/core/db";
import { collections } from "./schema";

/**
 * Checks whether a given path is inside another path's subtree
 * using PostgreSQL ltree operator `<@`.
 *
 * `<@` means:
 *   left_path is descendant of OR equal to right_path
 *
 * This uses database-level hierarchical comparison,
 * not string prefix logic.
 *
 * --------------------------------------------------
 * Example Collection Tree (Vehicles)
 * --------------------------------------------------
 *
 * vehicles
 * ├── vehicles.suv
 * │   ├── vehicles.suv.bmw
 * │   │   └── vehicles.suv.bmw.x5
 * │   └── vehicles.suv.audi
 * └── vehicles.sedan
 *
 * --------------------------------------------------
 * Examples
 * --------------------------------------------------
 *
 * existing.path = "vehicles.suv"
 *
 * isDescendantPath("vehicles.suv.bmw", "vehicles.suv")
 * → true   (bmw is inside suv)
 *
 * isDescendantPath("vehicles.suv.bmw.x5", "vehicles.suv")
 * → true   (x5 is deep inside suv)
 *
 * isDescendantPath("vehicles.suv", "vehicles.suv")
 * → true   (equal path is considered inside subtree)
 *
 * isDescendantPath("vehicles.sedan", "vehicles.suv")
 * → false  (different branch)
 *
 * isDescendantPath("property.residential", "vehicles")
 * → false  (different root)
 *
 * --------------------------------------------------
 * Use Case in Update Logic
 * --------------------------------------------------
 *
 * Prevent moving a collection under its own subtree:
 *
 * if (await isDescendantPath(parent.path, existing.path)) {
 *   throw errors.BAD_REQUEST();
 * }
 *
 * @param descendantPath - The candidate descendant path
 * @param ancestorPath - The candidate ancestor path
 * @returns true if descendantPath is inside ancestorPath subtree
 */
export async function isDescendantPath(
  descendantPath: string,
  ancestorPath: string,
): Promise<boolean> {
  const isInSubtree = await db
    .select({ ok: sql<number>`1` })
    .from(collections)
    .where(
      and(eq(collections.path, descendantPath), arrayContained(collections.path, ancestorPath)),
    )
    .limit(1);

  return isInSubtree.length > 0;
}

export function normalizePath(path: string) {
  return path.replaceAll("/", ".").toLowerCase();
}

export function normalizePathSafe(path?: string) {
  if (!path) return undefined;
  return normalizePath(path);
}
