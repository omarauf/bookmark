type Base = {
  id: string;
  parentId: string | null;
  slug: string;
};

type TreeNode<T> = T & { children: TreeNode<T>[] };

/** Keep matching collections with their descendants and the ancestors needed to display them. */
export function filterCollectionTree<T extends Base & { label: string }>(
  nodes: TreeNode<T>[],
  search: string,
): TreeNode<T>[] {
  const normalize = (value: string) => value.toLowerCase().replace(/[\s_-]+/g, "");
  const query = normalize(search);
  if (!query) return nodes;

  const filter = (current: TreeNode<T>[]): TreeNode<T>[] => {
    const result: TreeNode<T>[] = [];
    for (const node of current) {
      if (normalize(node.label).includes(query) || normalize(node.slug).includes(query)) {
        result.push(node);
        continue;
      }
      const children = filter(node.children);
      if (children.length > 0) result.push({ ...node, children });
    }
    return result;
  };

  return filter(nodes);
}

export function listToTree<T extends Base>(list: T[]): TreeNode<T>[] {
  const byId = new Map<string, TreeNode<T>>();

  for (const r of list) {
    byId.set(r.id, { ...r, children: [] });
  }

  const roots: TreeNode<T>[] = [];

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
  const sortRec = (nodes: TreeNode<T>[]) => {
    nodes.sort((a, b) => a.slug.localeCompare(b.slug));
    for (const n of nodes) if (n.children.length) sortRec(n.children);
  };
  sortRec(roots);

  return roots;
}
