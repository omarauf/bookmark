import type { ContextSlice } from "./slices/context-slice";
import type { DndSlice } from "./slices/dnd-slice";
import type { SelectAreaSlice } from "./slices/select-area-slice";
import type { SelectionSlice } from "./slices/selection-slice";
import type { UISlice } from "./slices/ui-slice";

export type StoreState = ContextSlice & DndSlice & SelectionSlice & SelectAreaSlice & UISlice;
