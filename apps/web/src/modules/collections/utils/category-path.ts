/**
 * Converts a dot-separated path (or array of paths) into an array of string segments.
 *
 * Behavior:
 * - If `paths` is undefined or null → returns an empty array.
 * - If `paths` is a string → splits the string by "." and returns all segments.
 * - If `paths` is an array of strings → returns only the last segment of each path.
 *
 * @param items - A dot-separated string (e.g. "a.b.c") or an array of dot-separated strings.
 *
 * @returns An array of strings:
 * - Full segments if input is a single string.
 * - Last segment of each item if input is an array.
 *
 * @example
 * // Single string input
 * pathToArray("property.commercial.office.rent");
 * // → ["property", "commercial", "office", "rent"]
 *
 * @example
 * // Array input (returns only last segment of each path)
 * pathToArray([
 *   "job",
 *   "job.engineering",
 *   "job.engineering.software",
 *   "job.engineering.software.frontend",
 * ]);
 * // → ["job", "engineering", "software", "frontend"]
 *
 * @example
 * // Array input
 * pathToArray(["job", "engineering", "software", "frontend"]);
 * // → ["job", "engineering", "software", "frontend"]
 *
 * @example
 * // Undefined input
 * pathToArray();
 * // → []
 */
export function toArray(items?: string[] | string): string[] {
  if (!items) return [];
  if (typeof items === "string") return items.split(".");
  return items.map((item) => {
    const parts = item.split(".");
    return parts[parts.length - 1];
  });
}

/**
 * Converts a string or array into a normalized dot-separated path.
 *
 * Behavior:
 * - If `items` is undefined or null → returns an empty string.
 * - If `items` is a string → returns the string as-is.
 * - If `items` is an array:
 *    - Each item is normalized using `toArray()` logic
 *    - Then joined using "." into a single path string.
 *
 * @param items - A dot-separated string or an array of strings representing path segments
 *                or cumulative dot-paths.
 *
 * @returns A normalized dot-separated string path.
 *
 * @example
 * // String input
 * toPath("job.engineering.software");
 * // → "job.engineering.software"
 *
 * @example
 * // Flat array input
 * toPath(["job", "engineering", "software"]);
 * // → "job.engineering.software"
 *
 * @example
 * // Cumulative path array input
 * toPath([
 *   "job",
 *   "job.engineering",
 *   "job.engineering.software",
 *   "job.engineering.software.frontend",
 * ]);
 * // → "job.engineering.software.frontend"
 *
 * @example
 * // Undefined input
 * toPath(undefined as any);
 * // → ""
 */
export function toPath(items?: string[] | string): string {
  if (!items) return "";
  if (typeof items === "string") return items;
  const p = toArray(items);
  return p.join(".");
}

/**
 * Returns a segment from a dot-separated path based on its level.
 *
 * Behavior:
 * - Accepts either a dot-separated string or an array of strings.
 * - Internally normalizes the input using `toArray()`.
 * - If `level` is **positive or zero**:
 *    - Counts from the end of the path.
 *    - `0` → last segment
 *    - `1` → second-to-last segment
 * - If `level` is **negative**:
 *    - Counts from the start of the path.
 *    - `-1` → first segment
 *    - `-2` → second segment
 * - Returns `undefined` if the level exceeds the path bounds.
 *
 * @param path - A dot-separated string (e.g. "a.b.c")
 *               or an array of strings representing path segments
 *               or cumulative dot-paths.
 * @param level - Index selector:
 *                - `0` = last segment
 *                - `1` = previous segment
 *                - `-1` = first segment
 *                - `-2` = second segment
 *
 * @returns The string segment at the specified level,
 *          or `undefined` if out of bounds.
 *
 * @example
 * pathAt("property.commercial.office.rent", 0);
 * // → "rent"
 *
 * @example
 * pathAt("property.commercial.office.rent", 2);
 * // → "commercial"
 *
 * @example
 * pathAt("property.commercial.office.rent", -1);
 * // → "property"
 *
 * @example
 * pathAt("property.commercial.office.rent", -2);
 * // → "commercial"
 *
 * @example
 * pathAt("a.b", 10);
 * // → undefined
 */
export function pathAt(path: string | string[], level: number) {
  const p = toArray(path);
  return p.at(-(level + 1));
}

/**
 * Returns a truncated dot-separated path up to a specific level.
 *
 * Behavior:
 * - Accepts either a dot-separated string or an array of strings.
 * - Internally normalizes the input using `toArray()`.
 * - If `level` is **positive or zero**:
 *    - Removes `level` segments from the end.
 *    - `0` → full path
 *    - `1` → removes last segment
 *    - `2` → removes last two segments
 * - If `level` is **negative**:
 *    - Interpreted relative to the end.
 *    - `-1` → keeps only the first segment
 *    - `-2` → keeps first two segments
 * - If `level` is greater than or equal to the path length → returns empty string.
 *
 * @param path - A dot-separated string (e.g. "a.b.c")
 *               or an array of strings representing path segments
 *               or cumulative dot-paths.
 * @param level - Number of segments to trim from the end (if ≥ 0),
 *                or negative index relative to path length.
 *
 * @returns A normalized dot-separated string up to the specified level,
 *          or an empty string if out of bounds.
 *
 * @example
 * pathTill("property.commercial.office.rent", 0);
 * // → "property.commercial.office.rent"
 *
 * @example
 * pathTill("property.commercial.office.rent", 1);
 * // → "property.commercial.office"
 *
 * @example
 * pathTill("property.commercial.office.rent", -1);
 * // → "property"
 *
 * @example
 * pathTill("a.b", 5);
 * // → ""
 */
export function pathTill(path: string | string[], level: number) {
  const p = toArray(path);
  let _level = level;
  if (_level >= p.length) return "";
  if (_level < 0) _level = p.length + _level;
  return p.slice(0, p.length - _level).join(".");
}

/**
 * Generates cumulative dot-path segments from a given path.
 *
 * Behavior:
 * - If `path` is undefined or null → returns an empty array.
 * - Accepts either a dot-separated string or an array of strings.
 * - Internally normalizes the input using `toArray()`.
 * - Returns progressive cumulative paths from root to leaf.
 *
 * @param path - A dot-separated string (e.g. "a.b.c")
 *               or an array of strings representing path segments
 *               or cumulative dot-paths.
 *
 * @returns An array of cumulative dot-separated paths.
 *
 * @example
 * toPathLevels("job.engineering.software.frontend");
 * // → [
 * //   "job",
 * //   "job.engineering",
 * //   "job.engineering.software",
 * //   "job.engineering.software.frontend"
 * // ]
 *
 * @example
 * toPathLevels(["job", "engineering", "software"]);
 * // → [
 * //   "job",
 * //   "job.engineering",
 * //   "job.engineering.software"
 * // ]
 *
 * @example
 * toPathLevels(undefined);
 * // → []
 */
export function pathLevels(path?: string[] | string) {
  if (!path) return [];
  const p = toArray(path);
  return p.map((_, index) => p.slice(0, index + 1).join("."));
}
