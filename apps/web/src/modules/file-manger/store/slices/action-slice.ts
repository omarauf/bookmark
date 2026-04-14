import { toast } from "sonner";
import type { StateCreator } from "zustand";
import { mockApi } from "../../data/mock-data";
import type { StoreState } from "../type";

export type ActionSlice = {
  handleRename: (itemId: string, newName: string) => Promise<void>;
  handleCreateFolder: (name: string) => Promise<void>;
};

export const createActionSlice: StateCreator<StoreState, [], [], ActionSlice> = (_, get) => ({
  handleRename: async (itemId, newName) => {
    try {
      const result = await mockApi.renameItem(itemId, newName);
      if (result.success) {
        // Update tree with new name (simplified)
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Failed to rename item", error);
      toast.error("Failed to rename item");
      throw error;
    }
  },

  handleCreateFolder: async (name) => {
    const { currentFolderId } = get();
    try {
      const result = await mockApi.createFolder(currentFolderId, name);
      if (result.success) {
        // Add new folder to tree (simplified)
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Failed to create folder", error);
      toast.error("Failed to create folder");
      throw error;
    }
  },
});
