import type { StateCreator } from "zustand";
import { mockFileTree } from "../../data/mock-data";
import type { FileItem } from "../../types";
import type { StoreState } from "../type";

export type FileTreeSlice = {
  fileTree: FileItem;
  setFileTree: (tree: FileItem) => void;
};

export const createFileTreeSlice: StateCreator<StoreState, [], [], FileTreeSlice> = (set) => ({
  fileTree: mockFileTree,
  setFileTree: (tree) => set({ fileTree: tree }),
});
