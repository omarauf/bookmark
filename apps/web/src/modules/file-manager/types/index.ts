export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modifiedAt: string;
  children?: FileItem[];
  parentId?: string;
}

export interface FileManagerState {
  currentFolderId: string;
  selectedItems: Set<string>;
  expandedFolders: Set<string>;
  viewMode: "grid" | "list";
  draggedItems: FileItem[];
  selectionHistory: Map<string, Set<string>>;
}

export interface DragData {
  items: FileItem[];
  sourceId: string;
}
