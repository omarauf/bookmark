import type { FileItem } from "../types";

export function findItemById(tree: FileItem, id: string): FileItem | null {
  if (tree.id === id) return tree;

  if (tree.children) {
    for (const child of tree.children) {
      const found = findItemById(child, id);
      if (found) return found;
    }
  }

  return null;
}

export function findIndexById(tree: FileItem, id: string): number {
  if (tree.children) {
    for (let i = 0; i < tree.children.length; i++) {
      if (tree.children[i].id === id) return i;
      const foundIndex = findIndexById(tree.children[i], id);
      if (foundIndex !== -1) return foundIndex;
    }
  }
  return -1;
}

export function findParentFolder(tree: FileItem, childId: string): FileItem | null {
  if (tree.children) {
    for (const child of tree.children) {
      if (child.id === childId) return tree;
      const found = findParentFolder(child, childId);
      if (found) return found;
    }
  }
  return null;
}

export function getAllDescendantIds(item: FileItem): string[] {
  const ids: string[] = [item.id];
  if (item.children) {
    for (const child of item.children) {
      ids.push(...getAllDescendantIds(child));
    }
  }
  return ids;
}

export function getAllInceptors(tree: FileItem, itemId: string): FileItem[] {
  const inceptors: FileItem[] = [];
  let currentItem = findItemById(tree, itemId);

  while (currentItem) {
    inceptors.unshift(currentItem);
    currentItem = findParentFolder(tree, currentItem.id);
  }

  return inceptors;
}

// TODO: use global
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

// TODO: use global
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isDescendantOf(ancestorId: string, descendantId: string, tree: FileItem): boolean {
  const ancestor = findItemById(tree, ancestorId);
  if (!ancestor) return false;

  const descendantIds = getAllDescendantIds(ancestor);
  return descendantIds.includes(descendantId);
}

export function generateUniqueFileName(name: string, existingNames: string[]): string {
  if (!existingNames.includes(name)) return name;

  const extension = name.includes(".") ? name.substring(name.lastIndexOf(".")) : "";
  const baseName = extension ? name.substring(0, name.lastIndexOf(".")) : name;

  let counter = 1;
  let newName = `${baseName} (copy)${extension}`;

  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName} (copy ${counter})${extension}`;
  }

  return newName;
}
