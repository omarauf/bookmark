import { create } from "zustand";
import { createClipboardSlice } from "./slices/clipboard-slice";
import { createDialogSlice } from "./slices/dialog-slice";
import { createDndSlice } from "./slices/dnd-slice";
import { createSelectionSlice } from "./slices/selection-slice";
import { createUiSlice } from "./slices/ui-slice";
import type { StoreState } from "./type";

export const useStore = create<StoreState>()((...a) => ({
  ...createClipboardSlice(...a),
  ...createDialogSlice(...a),
  ...createDndSlice(...a),
  ...createSelectionSlice(...a),
  ...createUiSlice(...a),
}));
