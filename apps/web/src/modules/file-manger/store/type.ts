import type { ActionSlice } from "./slices/action-slice";
import type { ContextSlice } from "./slices/context-slice";
import type { DndSlice } from "./slices/dnd-slice";
import type { NavigationSlice } from "./slices/navigation-slice";
import type { SelectAreaSlice } from "./slices/select-area-slice";
import type { SelectionSlice } from "./slices/selection-slice";
import type { FileTreeSlice } from "./slices/tree-slice";
import type { UISlice } from "./slices/ui-slice";

export type StoreState = ContextSlice &
  DndSlice &
  ActionSlice &
  FileTreeSlice &
  NavigationSlice &
  SelectionSlice &
  SelectAreaSlice &
  UISlice;
