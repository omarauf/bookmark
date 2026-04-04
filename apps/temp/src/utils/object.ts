export function jsonParse<T>(str: string): T | undefined {
  try {
    return JSON.parse(str) as T;
  } catch (e) {
    console.error("Invalid JSON:", e);
    return undefined;
  }
}
