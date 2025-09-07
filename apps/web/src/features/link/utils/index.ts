export * from "./filter";

export function getDomainAndTLD(url: string) {
  try {
    const { hostname } = new URL(url);

    // Remove subdomains, keep only domain and TLD
    const parts = hostname.split(".");

    if (parts.length >= 2) {
      const domain = parts[parts.length - 2];
      const tld = parts[parts.length - 1];
      return `${domain}.${tld}`;
    }

    return hostname; // fallback
  } catch {
    return ""; // invalid URL
  }
}

export function breadcrumbify(path?: string): { label: string; path: string }[] {
  if (path === undefined) return [];
  const segments = path.split("/").filter(Boolean); // remove empty strings
  const result: { label: string; path: string }[] = [];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    result.push({ label: segment, path: currentPath });
  }

  return result;
}
