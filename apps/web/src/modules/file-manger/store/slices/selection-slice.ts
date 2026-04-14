import type { StateCreator } from "zustand";
import type { FileItem } from "../../types";
import { findItemById } from "../../utils/file-utils";
import type { StoreState } from "../type";

export type SelectionSlice = {
  focusedIndex: number;
  // lastSelectedIndex: number;

  setFocusedIndex: (index: number) => void;

  handleItemClick: (item: FileItem, index: number, event: React.MouseEvent) => void;
};

export const createSelectionSlice: StateCreator<StoreState, [], [], SelectionSlice> = (
  set,
  get,
) => ({
  selectionHistory: new Map(),
  focusedIndex: 0,
  // lastSelectedIndex: -1,

  setFocusedIndex: (index) => set({ focusedIndex: index }),

  handleItemClick: (item, index, event) => {
    const { fileTree, currentFolderId, focusedIndex, selectedItems } = get();
    const { ctrlKey, metaKey, shiftKey } = event;
    const isMultiSelect = ctrlKey || metaKey;
    const isRangeSelect = shiftKey;
    event.stopPropagation();
    event.preventDefault();

    // TODO: idea to move the items to state in the store
    const currentFolder = findItemById(fileTree, currentFolderId);
    const items = currentFolder?.children || [];

    set({ focusedIndex: index });

    let newSelection = new Set(selectedItems);

    if (isRangeSelect && focusedIndex !== -1) {
      const selectedIndices = items
        .map((i, idx) => (newSelection.has(i.id) ? idx : -1))
        .filter((idx) => idx !== -1);

      if (selectedIndices.length === 0) return;

      const lower = Math.min(...selectedIndices);
      const upper = Math.max(...selectedIndices);

      let start = index;
      let end = index;

      if (selectedIndices.length > 1) {
        if (focusedIndex > lower && index < lower) {
          start = index;
          end = lower;
        } else if (focusedIndex < upper && index > upper) {
          start = upper;
          end = index;
        } else if (focusedIndex > lower && index < upper) {
          start = lower;
          end = index;
        } else if (focusedIndex < upper && index > lower) {
          start = index;
          end = upper;
        } else {
          start = Math.min(lower, index);
          end = Math.max(upper, index);
        }
      } else {
        start = Math.min(lower, index);
        end = Math.max(upper, index);
      }

      newSelection.clear();
      for (let i = start; i <= end; i++) {
        if (items[i]) {
          newSelection.add(items[i].id);
        }
      }
    } else if (isMultiSelect) {
      // Toggle selection
      if (newSelection.has(item.id)) {
        newSelection.delete(item.id);
      } else {
        newSelection.add(item.id);
      }
      set({ focusedIndex: index });
    } else {
      // Single selection
      newSelection = new Set([item.id]);
      set({ focusedIndex: index });
    }

    set({ selectedItems: newSelection });
  },
});
