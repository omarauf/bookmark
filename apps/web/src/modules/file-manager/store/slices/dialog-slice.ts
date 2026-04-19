import type { BrowseItem } from "@workspace/contracts/file-manager";
import type { StateCreator } from "zustand";
import type { StoreState } from "../type";

export type DialogState =
  | { type: "rename-file"; item: BrowseItem }
  | { type: "rename-folder"; item: BrowseItem }
  | { type: "newFolder"; parentId?: string }
  | { type: "properties"; itemId: string }
  | { type: "delete"; itemIds: string[] }
  | { type: "move"; itemIds: string[] };

export type DialogSlice = {
  dialog: DialogState | null;
  openDialog: (state: DialogState) => void;
  closeDialog: () => void;
};

export const createDialogSlice: StateCreator<StoreState, [], [], DialogSlice> = (set) => ({
  dialog: null,
  openDialog: (state) => set({ dialog: state }),
  closeDialog: () => set({ dialog: null }),
});
