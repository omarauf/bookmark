/** biome-ignore-all lint/suspicious/noExplicitAny: it has to be this way to avoid 404 not found errors when preloading a page */

export function jsonParse<T>(str: string): T | undefined {
  try {
    return JSON.parse(str) as T;
  } catch (e) {
    console.error("Invalid JSON:", e);
    return undefined;
  }
}

// 1. TypeScript Utility Type: Recursively updates the type definition
export type ReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends Date // Keep Dates intact
    ? T
    : T extends Array<infer U> // Handle Arrays
      ? Array<ReplaceNullWithUndefined<U>>
      : T extends object // Handle Objects
        ? { [K in keyof T]: ReplaceNullWithUndefined<T[K]> }
        : T; // Primitives (string, number, boolean, undefined) stay the same

// 2. The Runtime Function
export function replaceNullWithUndefined<T>(obj: T): ReplaceNullWithUndefined<T> {
  // Base case: if it's strictly null, return undefined
  if (obj === null) {
    return undefined as any;
  }

  // Handle Arrays: map over them and recursively call the function
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceNullWithUndefined(item)) as any;
  }

  // Handle plain Objects
  if (typeof obj === "object" && obj !== null) {
    // Exclude special object types like Dates if you use them
    if (obj instanceof Date) {
      return obj as any;
    }

    const result: any = {};
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        // Recursively call for nested objects/values
        result[key] = replaceNullWithUndefined(obj[key]);
      }
    }
    return result;
  }

  // Return primitives (strings, numbers, booleans, undefined) as they are
  return obj as any;
}
