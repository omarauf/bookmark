import { create } from "zustand";
import { createActionSlice } from "./slices/action-slice";
import { createContextSlice } from "./slices/context-slice";
import { createDndSlice } from "./slices/dnd-slice";
import { createNavigationSlice } from "./slices/navigation-slice";
import { createSelectAreaSlice } from "./slices/select-area-slice";
import { createSelectionSlice } from "./slices/selection-slice";
import { createFileTreeSlice } from "./slices/tree-slice";
import { createUiSlice } from "./slices/ui-slice";
import type { StoreState } from "./type";

export const useStore = create<StoreState>()((...a) => ({
  ...createFileTreeSlice(...a),
  ...createActionSlice(...a),
  ...createContextSlice(...a),
  ...createDndSlice(...a),
  ...createSelectionSlice(...a),
  ...createNavigationSlice(...a),
  ...createUiSlice(...a),
  ...createSelectAreaSlice(...a),
}));
