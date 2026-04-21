import type { StateCreator } from "zustand";
import type { StoreState } from "../type";

export type ClipboardSlice = {
  clipboard: {
    itemIds: Set<string>;
    sourceFolderId: string | undefined;
    operation: "cut";
  } | null;

  cutItems: (itemIds: Set<string>, sourceFolderId: string | undefined) => void;
  clearClipboard: () => void;
};

export const createClipboardSlice: StateCreator<StoreState, [], [], ClipboardSlice> = (set) => ({
  clipboard: null,

  cutItems: (itemIds, sourceFolderId) => {
    set({ clipboard: { itemIds, sourceFolderId, operation: "cut" } });
  },

  clearClipboard: () => set({ clipboard: null }),
});
