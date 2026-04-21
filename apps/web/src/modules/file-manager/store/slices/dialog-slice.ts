import type { StateCreator } from "zustand";
import type { StoreState } from "../type";

export type DialogState =
  | { type: "rename" }
  | { type: "newFolder" }
  | { type: "properties" }
  | { type: "delete" }
  | { type: "move" }
  | { type: "upload" };

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
