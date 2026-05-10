export function getQueryParam(url: string | undefined, key: string) {
  if (!url) return undefined;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get(key);
  } catch {
    return undefined;
  }
}
