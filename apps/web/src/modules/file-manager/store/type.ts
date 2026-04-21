import type { ClipboardSlice } from "./slices/clipboard-slice";
import type { DialogSlice } from "./slices/dialog-slice";
import type { DndSlice } from "./slices/dnd-slice";
import type { SelectionSlice } from "./slices/selection-slice";
import type { UISlice } from "./slices/ui-slice";

export type StoreState = ClipboardSlice & DialogSlice & DndSlice & SelectionSlice & UISlice;
