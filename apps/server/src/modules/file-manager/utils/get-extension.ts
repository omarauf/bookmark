export function getExtension(input: string): string | undefined {
  try {
    // Try URL first
    const url = new URL(input);
    return extractFromPath(url.pathname);
  } catch {
    // Fallback: treat as file path
    return extractFromPath(input);
  }
}

function extractFromPath(path: string): string | undefined {
  const lastSegment = path.split(/[\\/]/).pop(); // handles / and \

  if (!lastSegment) return undefined;

  const match = lastSegment.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : undefined;
}
