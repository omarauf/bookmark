import { createRef } from "react";
import type { StateCreator } from "zustand";
import { clamp, DOMVector, intersect } from "../../utils/dom-vector";
import type { StoreState } from "../type";

const dragThreshold = 10;
const autoScrollThreshold = 20;
const autoScrollSpeed = 15;
const disabled = false;

export type SelectAreaSlice = {
  dragVector: DOMVector | null;
  scrollVector: DOMVector | null;
  selectedItems: Set<string>;
  dragStartSelection: Set<string>;
  isDragging: boolean;
  isCtrlPressed: boolean;
  isShiftPressed: boolean;
  isMetaPressed: boolean;

  containerRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: Map<string, HTMLElement>;
  registerItemRef: (element: HTMLElement | null) => void;

  scrollAnimationHandle: number | null;
  startAutoScroll: () => void;
  stopAutoScroll: () => void;

  clearSelection: () => void;
  updateSelectedItems: (dragVector: DOMVector, scrollVector: DOMVector) => void;
  handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleScroll: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleKeyUp: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

export const createSelectAreaSlice: StateCreator<StoreState, [], [], SelectAreaSlice> = (
  set,
  get,
) => ({
  dragVector: null,
  scrollVector: null,
  selectedItems: new Set<string>(),
  dragStartSelection: new Set<string>(),
  isDragging: false,
  isCtrlPressed: false,
  isShiftPressed: false,
  isMetaPressed: false,

  containerRef: createRef<HTMLDivElement>(),
  itemRefs: new Map<string, HTMLElement>(),

  registerItemRef: (element) => {
    const elementId = element?.id;
    if (!elementId) return;

    set((state) => {
      // clone to trigger reactivity
      const refs = new Map(state.itemRefs);
      if (element) refs.set(elementId, element);
      else refs.delete(elementId);
      return { itemRefs: refs };
    });
  },

  scrollAnimationHandle: null,

  startAutoScroll: () => {
    const loop = () => {
      const { containerRef, dragVector } = get();

      if (!containerRef.current || !dragVector || disabled) {
        get().stopAutoScroll();
        return;
      }

      const currentPointer = dragVector.toTerminalPoint();
      const containerRect = containerRef.current.getBoundingClientRect();

      const shouldScrollRight = containerRect.width - currentPointer.x < autoScrollThreshold;
      const shouldScrollLeft = currentPointer.x < autoScrollThreshold;
      const shouldScrollDown = containerRect.height - currentPointer.y < autoScrollThreshold;
      const shouldScrollUp = currentPointer.y < autoScrollThreshold;

      const left = shouldScrollRight
        ? clamp(autoScrollThreshold - containerRect.width + currentPointer.x, 0, autoScrollSpeed)
        : shouldScrollLeft
          ? -1 * clamp(autoScrollThreshold - currentPointer.x, 0, autoScrollSpeed)
          : undefined;

      const top = shouldScrollDown
        ? clamp(autoScrollThreshold - containerRect.height + currentPointer.y, 0, autoScrollSpeed)
        : shouldScrollUp
          ? -1 * clamp(autoScrollThreshold - currentPointer.y, 0, autoScrollSpeed)
          : undefined;

      if (top !== undefined || left !== undefined) {
        containerRef.current.scrollBy({ left, top });
      }

      const handle = requestAnimationFrame(loop);
      set({ scrollAnimationHandle: handle });
    };

    // start loop
    const handle = requestAnimationFrame(loop);
    set({ scrollAnimationHandle: handle });
  },

  stopAutoScroll: () => {
    const { scrollAnimationHandle } = get();
    if (scrollAnimationHandle !== null) {
      cancelAnimationFrame(scrollAnimationHandle);
      set({ scrollAnimationHandle: null });
    }
  },

  clearSelection: () => set({ selectedItems: new Set<string>() }),

  updateSelectedItems: (dragVector, scrollVector) => {
    const {
      containerRef,
      itemRefs,
      dragStartSelection,
      isCtrlPressed,
      isShiftPressed,
      isMetaPressed,
    } = get();
    if (containerRef.current == null || disabled) return;

    const next: Record<string, boolean> = {};
    const containerRect = containerRef.current.getBoundingClientRect();

    itemRefs.forEach((element, itemId) => {
      if (containerRef.current == null || !(element instanceof HTMLElement)) return;

      const itemRect = element.getBoundingClientRect();
      const x = itemRect.x - containerRect.x + containerRef.current.scrollLeft;
      const y = itemRect.y - containerRect.y + containerRef.current.scrollTop;
      const translatedItemRect = new DOMRect(x, y, itemRect.width, itemRect.height);

      if (!intersect(dragVector.add(scrollVector).toDOMRect(), translatedItemRect)) return;

      if (itemId && typeof itemId === "string") {
        next[itemId] = true;
      }
    });

    let newSelection: Set<string>;

    if (isShiftPressed) {
      // Add intersected items to snapshot selection
      newSelection = new Set(dragStartSelection);
      Object.keys(next).forEach((id) => {
        newSelection.add(id);
      });
    } else if (isCtrlPressed || isMetaPressed) {
      // Toggle relative to snapshot selection
      newSelection = new Set(dragStartSelection);
      Object.keys(next).forEach((id) => {
        if (dragStartSelection.has(id)) {
          newSelection.delete(id);
        } else {
          newSelection.add(id);
        }
      });
    } else {
      // Replace selection with only intersected
      newSelection = new Set(Object.keys(next));
    }

    set({ selectedItems: newSelection });
  },

  handlePointerDown: (e) => {
    if (e.button !== 0 || disabled) return;
    const containerRect = e.currentTarget.getBoundingClientRect();

    set({
      dragStartSelection: new Set(get().selectedItems),
      dragVector: new DOMVector(e.clientX - containerRect.x, e.clientY - containerRect.y, 0, 0),
      scrollVector: new DOMVector(e.currentTarget.scrollLeft, e.currentTarget.scrollTop, 0, 0),
    });

    // this will be captured on down and it prevent from listening to double click on items
    // so we only capture when dragging starts in pointer move
    // so we moved this to pointer move handler
    // e.currentTarget.setPointerCapture(e.pointerId);
  },

  handlePointerMove: (e) => {
    const {
      dragVector,
      scrollVector,
      isDragging,
      containerRef,
      updateSelectedItems,
      startAutoScroll,
    } = get();
    if (dragVector == null || scrollVector == null || disabled) return;

    const containerRect = e.currentTarget.getBoundingClientRect();

    const nextDragVector = new DOMVector(
      dragVector.x,
      dragVector.y,
      e.clientX - containerRect.x - dragVector.x,
      e.clientY - containerRect.y - dragVector.y,
    );

    if (!isDragging && nextDragVector.getDiagonalLength() < dragThreshold) return;

    if (!isDragging) {
      set({ isDragging: true });
      startAutoScroll(); // start scroll loop
    }

    // Only capture when dragging starts
    // so we can still listen to double click on items
    // and we can tell if mouse is released outside the container
    e.currentTarget.setPointerCapture(e.pointerId);
    containerRef.current?.focus();
    set({ dragVector: nextDragVector });
    updateSelectedItems(nextDragVector, scrollVector);
  },

  handlePointerUp: (e) => {
    const { isDragging, stopAutoScroll } = get();
    const isModifier = e.altKey || e.metaKey || e.ctrlKey || e.shiftKey;
    if (!isDragging && !isModifier) {
      set({ selectedItems: new Set<string>(), dragVector: null });
    } else {
      set({ isDragging: false, dragVector: null });
    }
    set({ scrollVector: null });
    stopAutoScroll(); // stop loop
  },

  handleScroll: (e) => {
    if (disabled) return;
    const { dragVector, scrollVector, updateSelectedItems } = get();
    if (dragVector == null || scrollVector == null) return;

    const { scrollLeft, scrollTop } = e.currentTarget;

    const nextScrollVector = new DOMVector(
      scrollVector.x,
      scrollVector.y,
      scrollLeft - scrollVector.x,
      scrollTop - scrollVector.y,
    );

    set({ scrollVector: nextScrollVector });
    updateSelectedItems(dragVector, nextScrollVector);
  },

  handleKeyDown: (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      set({ selectedItems: new Set<string>(), dragVector: null, isDragging: false });
    }
    if (e.key === "Control") {
      set({ isCtrlPressed: true });
    }
    if (e.key === "Shift") {
      set({ isShiftPressed: true });
    }
    if (e.key === "Meta") {
      set({ isMetaPressed: true });
    }
    // set({ dragVector: null });
  },

  handleKeyUp: (e) => {
    if (e.key === "Control") {
      set({ isCtrlPressed: false });
    }
    if (e.key === "Shift") {
      set({ isShiftPressed: false });
    }
    if (e.key === "Meta") {
      set({ isMetaPressed: false });
    }
  },
});
