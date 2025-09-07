export function countCharacter(char: string, word: string): number {
  return word.split(char).length - 1;
}

export function trimAfterXCharacter(str: string, x: number, char: string): string {
  const parts = str.split(char);
  if (parts.length <= x) return str;
  return parts.slice(0, x).join(char);
}
