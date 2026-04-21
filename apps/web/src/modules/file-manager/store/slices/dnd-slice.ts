import type { StateCreator } from "zustand";
import type { StoreState } from "../type";

export type DndSlice = {
  isDragging: boolean;
  dragSourceFolderId: string | undefined;
  dropTargetFolderId: string | undefined;
  dropOperation: "move" | "copy";

  startDrag: (activeId: string, currentFolderId: string | undefined, isCopyIntent: boolean) => void;
  updateDropTarget: (folderId: string | undefined) => void;
  setDropOperation: (operation: "move" | "copy") => void;
  clearDragState: () => void;
};

export const createDndSlice: StateCreator<StoreState, [], [], DndSlice> = (set, get) => ({
  isDragging: false,
  dragSourceFolderId: undefined,
  dropTargetFolderId: undefined,
  dropOperation: "move",

  startDrag: (activeId, currentFolderId, isCopyIntent) => {
    const { selectedItems } = get();

    // If the dragged item is not in the current selection,
    // we select it as the only selected item
    const shouldDragSelection = selectedItems.has(activeId);
    if (!shouldDragSelection) {
      const { selectSingleItem, focusedIndex } = get();
      selectSingleItem(activeId, focusedIndex);
    }

    set({
      isDragging: true,
      dragSourceFolderId: currentFolderId,
      dropTargetFolderId: undefined,
      dropOperation: isCopyIntent ? "copy" : "move",
    });
  },

  updateDropTarget: (folderId) => set({ dropTargetFolderId: folderId }),

  setDropOperation: (operation) => set({ dropOperation: operation }),

  clearDragState: () =>
    set({
      isDragging: false,
      dragSourceFolderId: undefined,
      dropTargetFolderId: undefined,
      dropOperation: "move",
    }),
});
