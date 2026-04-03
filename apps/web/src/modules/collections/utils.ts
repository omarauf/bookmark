import type { Collection, CollectionTree } from "@workspace/contracts/collection";

export function listToTree(list: Collection[]): CollectionTree[] {
  const byId = new Map<string, CollectionTree>();

  for (const r of list) {
    byId.set(r.id, { ...r, children: [] });
  }

  const roots: CollectionTree[] = [];

  for (const r of list) {
    const node = byId.get(r.id);
    if (!node) continue;
    if (!r.parentId) {
      roots.push(node);
      continue;
    }
    const parent = byId.get(r.parentId);
    if (!parent) {
      // parent not included in this fetch => treat as root for now
      roots.push(node);
      continue;
    }
    parent.children.push(node);
  }

  // sort recursively by slug
  const sortRec = (nodes: CollectionTree[]) => {
    nodes.sort((a, b) => a.slug.localeCompare(b.slug));
    for (const n of nodes) if (n.children.length) sortRec(n.children);
  };
  sortRec(roots);

  return roots;
}
