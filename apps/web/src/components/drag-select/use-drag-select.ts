import { useCallback, useEffect, useRef, useState } from "react";
import type { ContainerProps } from "./type";

class DOMVector {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly magnitudeX: number,
    readonly magnitudeY: number,
  ) {
    this.x = x;
    this.y = y;
    this.magnitudeX = magnitudeX;
    this.magnitudeY = magnitudeY;
  }

  toDOMRect(): DOMRect {
    return new DOMRect(
      Math.min(this.x, this.x + this.magnitudeX),
      Math.min(this.y, this.y + this.magnitudeY),
      Math.abs(this.magnitudeX),
      Math.abs(this.magnitudeY),
    );
  }

  getDiagonalLength(): number {
    return Math.sqrt(this.magnitudeX ** 2 + this.magnitudeY ** 2);
  }

  add(vector: DOMVector): DOMVector {
    return new DOMVector(
      this.x + vector.x,
      this.y + vector.y,
      this.magnitudeX + vector.magnitudeX,
      this.magnitudeY + vector.magnitudeY,
    );
  }

  clamp(vector: DOMRect): DOMVector {
    return new DOMVector(
      this.x,
      this.y,
      Math.min(vector.width - this.x, this.magnitudeX),
      Math.min(vector.height - this.y, this.magnitudeY),
    );
  }

  toTerminalPoint(): DOMPoint {
    return new DOMPoint(this.x + this.magnitudeX, this.y + this.magnitudeY);
  }
}

function intersect(rect1: DOMRect, rect2: DOMRect) {
  if (rect1.right < rect2.left || rect2.right < rect1.left) return false;
  if (rect1.bottom < rect2.top || rect2.bottom < rect1.top) return false;
  return true;
}

interface UseDragSelectOptions {
  selectedItems?: Set<string>;
  setSelectedItems?: (selectedItems: Set<string>) => void;

  itemSelector?: string;
  itemDataAttribute?: string;
  dragThreshold?: number;
  autoScrollThreshold?: number;
  autoScrollSpeed?: number;
  disabled?: boolean;
  onSelectionStart?: () => void;
  onSelectionEnd?: () => void;
}

interface UseDragSelectReturn {
  selectedItems: Set<string>;
  isDragging: boolean;
  selectionRect: DOMRect | null;
  clearSelection: () => void;
  containerProps: ContainerProps;
}

export function useDragSelect({
  selectedItems,
  itemSelector = "[data-item]",
  itemDataAttribute = "item",
  dragThreshold = 10,
  autoScrollThreshold = 20,
  autoScrollSpeed = 15,
  disabled = false,
  setSelectedItems,
  onSelectionStart,
  onSelectionEnd,
}: UseDragSelectOptions = {}): UseDragSelectReturn {
  const [dragVector, setDragVector] = useState<DOMVector | null>(null);
  const [scrollVector, setScrollVector] = useState<DOMVector | null>(null);
  const [_selectedItems, _setSelectedItems] = useState<Set<string>>(selectedItems ?? new Set());
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = selectedItems !== undefined;
  const currentSelectedItems = isControlled ? selectedItems : _selectedItems;

  // biome-ignore lint/correctness/useExhaustiveDependencies: no need to add deps
  const setter = useCallback((v: Set<string>) => {
    if (!isControlled) {
      _setSelectedItems(v);
    }
    setSelectedItems?.(v);
  }, []);

  const clearSelection = useCallback(() => {
    setter(new Set());
  }, [setter]);

  const updateSelectedItems = useCallback(
    function updateSelectedItems(dragVector: DOMVector, scrollVector: DOMVector) {
      if (containerRef.current == null || disabled) return;

      const next: Record<string, boolean> = {};
      const containerRect = containerRef.current.getBoundingClientRect();

      containerRef.current.querySelectorAll(itemSelector).forEach((el) => {
        if (containerRef.current == null || !(el instanceof HTMLElement)) return;

        const itemRect = el.getBoundingClientRect();
        const x = itemRect.x - containerRect.x + containerRef.current.scrollLeft;
        const y = itemRect.y - containerRect.y + containerRef.current.scrollTop;
        const translatedItemRect = new DOMRect(x, y, itemRect.width, itemRect.height);

        if (!intersect(dragVector.add(scrollVector).toDOMRect(), translatedItemRect)) return;

        const itemId = el.dataset[itemDataAttribute];
        if (itemId && typeof itemId === "string") {
          next[itemId] = true;
        }
      });

      setter(new Set(Object.keys(next)));
    },
    [itemSelector, itemDataAttribute, disabled, setter],
  );

  // Auto-scroll effect
  useEffect(() => {
    if (!isDragging || containerRef.current == null || disabled) return;

    let handle = requestAnimationFrame(scrollContainer);

    return () => cancelAnimationFrame(handle);

    function clamp(num: number, min: number, max: number) {
      return Math.min(Math.max(num, min), max);
    }

    function scrollContainer() {
      if (containerRef.current == null || dragVector == null) return;

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

      if (top === undefined && left === undefined) {
        handle = requestAnimationFrame(scrollContainer);
        return;
      }

      containerRef.current.scrollBy({ left, top });
      handle = requestAnimationFrame(scrollContainer);
    }
  }, [isDragging, dragVector, disabled, autoScrollThreshold, autoScrollSpeed]);

  const selectionRect =
    dragVector && scrollVector && isDragging && containerRef.current
      ? dragVector
          .add(scrollVector)
          .clamp(
            new DOMRect(0, 0, containerRef.current.scrollWidth, containerRef.current.scrollHeight),
          )
          .toDOMRect()
      : null;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 || disabled) return;
      const containerRect = e.currentTarget.getBoundingClientRect();

      setDragVector(new DOMVector(e.clientX - containerRect.x, e.clientY - containerRect.y, 0, 0));
      setScrollVector(new DOMVector(e.currentTarget.scrollLeft, e.currentTarget.scrollTop, 0, 0));

      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [disabled],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
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
        setIsDragging(true);
        onSelectionStart?.();
      }

      containerRef.current?.focus();
      setDragVector(nextDragVector);
      updateSelectedItems(nextDragVector, scrollVector);
    },
    [
      dragVector,
      scrollVector,
      isDragging,
      dragThreshold,
      updateSelectedItems,
      onSelectionStart,
      disabled,
    ],
  );

  const handlePointerUp = useCallback(() => {
    if (disabled) return;
    if (!isDragging) {
      clearSelection();
      setDragVector(null);
    } else {
      setDragVector(null);
      setIsDragging(false);
      onSelectionEnd?.();
    }
    setScrollVector(null);
  }, [isDragging, disabled, clearSelection, onSelectionEnd]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (dragVector == null || scrollVector == null) return;

      const { scrollLeft, scrollTop } = e.currentTarget;

      const nextScrollVector = new DOMVector(
        scrollVector.x,
        scrollVector.y,
        scrollLeft - scrollVector.x,
        scrollTop - scrollVector.y,
      );

      setScrollVector(nextScrollVector);
      updateSelectedItems(dragVector, nextScrollVector);
    },
    [dragVector, scrollVector, disabled, updateSelectedItems],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        clearSelection();
        setDragVector(null);
        setIsDragging(false);
      }
      setScrollVector(null);
    },
    [clearSelection],
  );

  return {
    selectedItems: currentSelectedItems,
    isDragging,
    selectionRect,
    clearSelection,
    containerProps: {
      ref: containerRef,
      tabIndex: -1,
      disabled,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onScroll: handleScroll,
      onKeyDown: handleKeyDown,
    },
  };
}
