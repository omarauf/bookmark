export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modifiedAt: string;
  children?: FileItem[];
  parentId?: string;
}

export interface DragData {
  items: FileItem[];
  sourceId: string;
}
