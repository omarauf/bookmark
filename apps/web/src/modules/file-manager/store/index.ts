import { create } from "zustand";
import { createContextSlice } from "./slices/context-slice";
import { createDndSlice } from "./slices/dnd-slice";
import { createSelectAreaSlice } from "./slices/select-area-slice";
import { createSelectionSlice } from "./slices/selection-slice";
import { createUiSlice } from "./slices/ui-slice";
import type { StoreState } from "./type";

export const useStore = create<StoreState>()((...a) => ({
  ...createContextSlice(...a),
  ...createDndSlice(...a),
  ...createSelectionSlice(...a),
  ...createUiSlice(...a),
  ...createSelectAreaSlice(...a),
}));
