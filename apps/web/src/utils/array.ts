export const createKeys = (count: number) =>
  Array.from({ length: count }, () => crypto.randomUUID());
