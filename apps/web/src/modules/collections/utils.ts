type Base = {
  id: string;
  parentId: string | null;
  slug: string;
};

type TreeNode<T> = T & { children: TreeNode<T>[] };

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
