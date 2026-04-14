import { toast } from "sonner";
import type { StateCreator } from "zustand";
import { mockApi } from "../../data/mock-data";
import type { FileItem } from "../../types";
import type { StoreState } from "../type";

export type ContextSlice = {
  rename: { open: boolean; item: FileItem | null };
  newFolder: { open: boolean };
  properties: { open: boolean; item: FileItem | null };

  toggleRename: (open: boolean) => void;
  toggleNewFolder: (open: boolean) => void;
  toggleProperties: (open: boolean) => void;

  onCopy: (items: FileItem[]) => Promise<void>;
  onMove: (items: FileItem[]) => Promise<void>;
  onDelete: (items: FileItem[]) => Promise<void>;
  onRename: (item: FileItem) => Promise<void>;
  onDownload: (items: FileItem[]) => Promise<void>;
  onNewFolder: () => Promise<void>;
  onUpload: () => Promise<void>;
  onProperties: (item: FileItem) => Promise<void>;
};

export const createContextSlice: StateCreator<StoreState, [], [], ContextSlice> = (set, get) => ({
  rename: { open: false, item: null },
  newFolder: { open: false },
  properties: { open: false, item: null },

  toggleRename: (open: boolean) => {
    const { rename } = get();
    set({ rename: { open, item: rename.item } });
  },

  toggleNewFolder: (open: boolean) => {
    set({ newFolder: { open } });
  },

  toggleProperties: (open: boolean) => {
    const { properties } = get();
    set({ properties: { open, item: properties.item } });
  },

  onCopy: async (items) => {
    toast.success(`${items.length} item(s) copied to clipboard`);
  },

  onMove: async (items) => {
    toast.success(`${items.length} item(s) cut to clipboard`);
  },

  onDelete: async (items) => {
    try {
      const result = await mockApi.deleteItems(items.map((item) => item.id));
      if (result.success) {
        // Remove items from tree (simplified - in real app would update properly)
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Failed to delete items", error);
      toast.error("Failed to delete items");
    }
  },

  onRename: async (item) => {
    set({ rename: { open: true, item } });
  },

  onDownload: async (items) => {
    toast.success(`Downloading ${items.length} item(s)...`);
  },

  onNewFolder: async () => {
    set({ newFolder: { open: true } });
  },

  onUpload: async () => {
    toast.success("Upload functionality would be implemented here");
  },

  onProperties: async (item) => {
    set({ properties: { open: true, item } });
  },
});
