import { resolveLtreeLabel, slugify } from "@workspace/core/slugify";

export function getSlugPath(name: string, slug = "") {
  const selectedSlug = slug.trim().length > 0 ? slug : name;
  const slugValue = slugify(selectedSlug, { lower: true })
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll(".", "");
  const pathLabel = resolveLtreeLabel(selectedSlug);
  return { slug: slugValue, path: pathLabel };
}

/**
 * Checks for hierarchical conflicts in a list of items based on their dot-separated paths.
 *
 * A conflict occurs when one item's path is a descendant of another item's path.
 * For example, "music.arabic" is considered a child of "music".
 *
 * The function compares each item against all others and detects whether
 * any path starts with another path followed by a dot (".").
 *
 * @param {Array<{ path: string, label: string }>} data
 * An array of items where:
 * - `path` is a dot-separated string representing hierarchy (e.g., "music.arabic")
 * - `label` is a human-readable name for the item
 *
 * @returns {true | Array<{
 *   childItem: string,
 *   parentItem: string,
 *   problem: string
 * }>}
 * Returns `true` if no conflicts are found.
 * Otherwise, returns an array of conflict objects describing each issue.
 *
 * @example
 * // No conflicts
 * const data = [
 *   { path: "music", label: "Music" },
 *   { path: "sports", label: "Sports" }
 * ];
 *
 * checkHierarchyConflicts(data);
 * // → true
 *
 * @example
 * // With conflicts
 * const data = [
 *   { path: "music", label: "Music" },
 *   { path: "music.arabic", label: "Arabic Music" }
 * ];
 *
 * checkHierarchyConflicts(data);
 * // → [
 * //   {
 * //     childItem: "Arabic Music",
 * //     parentItem: "Music",
 * //     problem: "The item 'music.arabic' is nested under 'music'"
 * //   }
 * // ]
 *
 * @note
 * - Time complexity is O(n²) due to nested comparisons.
 * - Detects all ancestor conflicts, not just direct parent relationships.
 */
export function checkHierarchyConflicts(data: { path: string; label: string }[]):
  | true
  | Array<{
      childItem: string;
      parentItem: string;
      problem: string;
    }> {
  const conflicts = [];

  // Compare every item against every other item
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      // Don't compare an item to itself
      if (i === j) continue;

      const potentialChild = data[i];
      const potentialParent = data[j];

      // Check if one path is a descendant of another
      // We add "." to ensure "music.arabic" matches "music."
      // but "musician" does NOT match "music."
      if (potentialChild.path.startsWith(`${potentialParent.path}.`)) {
        conflicts.push({
          childItem: potentialChild.label,
          parentItem: potentialParent.label,
          problem: `The item '${potentialChild.path}' is nested under '${potentialParent.path}'`,
        });
      }
    }
  }

  // If no conflicts were found, return true
  if (conflicts.length === 0) {
    return true;
  }

  // Otherwise, return the array of problems
  return conflicts;
}

/**
 * Filters an array of hierarchical items, retaining only the most deeply nested items.
 * It removes any item that acts as a parent to another item currently in the array,
 * determined by checking if any other item's path starts with the current item's path plus a dot.
 *
 * @template { { path: string } } T
 * @param {T[]} data - The array of objects to filter. Each object must have at least a `path` string property.
 * @returns {T[]} A new array containing only the "leaf" items (items that have no children present in the provided array).
 *
 * @example
 * const items = [
 * { label: "music", path: "music" },
 * { label: "food", path: "food" },
 * { label: "arabic", path: "music.arabic" }
 * ];
 * const filtered = filterForDeepestPaths(items);
 * // Returns: [
 * //   { label: "food", path: "food" },
 * //   { label: "arabic", path: "music.arabic" }
 * // ]
 */
export function filterForDeepestPaths<T extends { path: string }>(data: T[]): T[] {
  const d = removeDuplicatePaths(data);
  return d.filter((currentItem) => {
    // Check if ANY other item in the array is a child of the currentItem
    const hasChildInArray = d.some((otherItem) =>
      otherItem.path.startsWith(`${currentItem.path}.`),
    );

    // If it has a child in the list, filter it out (return false).
    // If it's the deepest level (no children), keep it (return true).
    return !hasChildInArray;
  });
}

export function removeDuplicatePaths<T extends { path: string }>(data: T[]) {
  const seenPaths = new Set();
  return data.filter((item) => {
    if (seenPaths.has(item.path)) {
      return false; // Duplicate found, filter it out
    } else {
      seenPaths.add(item.path); // Mark this path as seen
      return true; // Keep this item
    }
  });
}
