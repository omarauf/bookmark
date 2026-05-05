export function isAnimeId(id: string): boolean {
  return /^\d+$/.test(id);
}
