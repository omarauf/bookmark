export function isImdbId(str: string): boolean {
  return /^tt\d+$/.test(str);
}
