import type { Folder, FolderTree } from "@workspace/contracts/file-manager";

export function findNode(items: FolderTree[], id: string): FolderTree | null {
  for (const item of items) {
    if (item.id === id) return item;
    const nested = findNode(item.children, id);
    if (nested) return nested;
  }

  return null;
}

export function buildMap(items: FolderTree[]) {
  const map = new Map<string, FolderTree>();
  for (const item of items) {
    map.set(item.id, item);
    buildMap(item.children);
  }

  return map;
}

export function folderRowsToNodes(rows: Folder[]): FolderTree[] {
  const nodeMap = new Map<string, FolderTree>();
  const rootNodes: FolderTree[] = [];

  for (const row of rows) {
    nodeMap.set(row.id, { ...row, children: [] });
  }

  for (const node of nodeMap.values()) {
    if (node.parentId && nodeMap.has(node.parentId)) {
      nodeMap.get(node.parentId)?.children.push(node);
    } else {
      rootNodes.push(node);
    }
  }

  const sortNodes = (nodes: FolderTree[]) => {
    nodes.sort((left, right) => left.name.localeCompare(right.name));
    for (const node of nodes) sortNodes(node.children);
  };

  sortNodes(rootNodes);
  return rootNodes;
}
