/** biome-ignore-all lint/suspicious/noExplicitAny: this is a lib */

export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

export function containsData(obj: Record<string, unknown> | undefined): boolean {
  if (obj === undefined) return false;
  if (Object.keys(obj).length === 0) return false;

  return Object.values(obj).some(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      (!Array.isArray(value) || value.length > 0),
  );
}

export function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}
