export function arrayEqual<T>(a: T[], b: T[], keys: (keyof T)[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    for (const key of keys) {
      if (a[i]?.[key] !== b[i]?.[key]) return false;
    }
  }
  return true;
}
