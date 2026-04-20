import { createRef } from "react";
import type { StateCreator } from "zustand";
import type { StoreState } from "../type";

export type SelectionSlice = {
  focusedIndex: number;
  selectionAnchorIndex: number | null;
  selectedItems: Set<string>;
  setSelectedItems: (selectedItems: Set<string>) => void;

  containerRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: Map<string, HTMLElement>;
  registerItemRef: (element: HTMLElement | null) => void;

  setFocusedIndex: (index: number) => void;
  clearSelection: () => void;
  selectAllItems: (orderedIds: string[]) => void;
  selectSingleItem: (itemId: string, index: number) => void;
  toggleSelectedItem: (itemId: string, index: number) => void;
  selectItemRange: (orderedIds: string[], index: number) => void;
  toggleFocusedItemSelection: (orderedIds: string[]) => void;
};

export const createSelectionSlice: StateCreator<StoreState, [], [], SelectionSlice> = (set) => ({
  focusedIndex: 0,
  selectionAnchorIndex: null,
  selectedItems: new Set<string>(),
  setSelectedItems: (selectedItems) => set({ selectedItems }),

  containerRef: createRef<HTMLDivElement>(),
  itemRefs: new Map<string, HTMLElement>(),

  registerItemRef: (element) => {
    const elementId = element?.id;
    if (!elementId) return;

    set((state) => {
      const refs = new Map(state.itemRefs);
      if (element) refs.set(elementId, element);
      else refs.delete(elementId);
      return { itemRefs: refs };
    });
  },

  setFocusedIndex: (index) => set({ focusedIndex: index }),

  clearSelection: () =>
    set((state) => ({
      selectedItems: new Set<string>(),
      selectionAnchorIndex: state.focusedIndex,
    })),

  selectAllItems: (orderedIds) =>
    set((state) => ({
      selectedItems: new Set(orderedIds),
      selectionAnchorIndex: state.focusedIndex,
    })),

  selectSingleItem: (itemId, index) =>
    set({
      selectedItems: new Set([itemId]),
      focusedIndex: index,
      selectionAnchorIndex: index,
    }),

  toggleSelectedItem: (itemId, index) =>
    set((state) => {
      const selectedItems = new Set(state.selectedItems);

      if (selectedItems.has(itemId)) {
        selectedItems.delete(itemId);
      } else {
        selectedItems.add(itemId);
      }

      return {
        selectedItems,
        focusedIndex: index,
        selectionAnchorIndex: index,
      };
    }),

  selectItemRange: (orderedIds, index) =>
    set((state) => {
      const anchor = state.selectionAnchorIndex ?? state.focusedIndex;
      const start = Math.min(anchor, index);
      const end = Math.max(anchor, index);
      const selectedItems = new Set<string>();

      for (let i = start; i <= end; i++) {
        const itemId = orderedIds[i];
        if (itemId) selectedItems.add(itemId);
      }

      return {
        selectedItems,
        focusedIndex: index,
        selectionAnchorIndex: anchor,
      };
    }),

  toggleFocusedItemSelection: (orderedIds) =>
    set((state) => {
      const itemId = orderedIds[state.focusedIndex];
      if (!itemId) {
        return state;
      }

      const selectedItems = new Set(state.selectedItems);

      if (selectedItems.has(itemId)) {
        selectedItems.delete(itemId);
      } else {
        selectedItems.add(itemId);
      }

      return {
        selectedItems,
        selectionAnchorIndex: state.focusedIndex,
      };
    }),
});
