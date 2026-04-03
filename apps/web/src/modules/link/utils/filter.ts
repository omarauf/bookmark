import type { SearchLink } from "../schema";

export function getFilterType(search: SearchLink): "tree" | "list" {
  if (search.q) return "list";
  if (search.domain) return "list";

  return "tree";
}
