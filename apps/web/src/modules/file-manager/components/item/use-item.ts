import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { useStore } from "../../store";
import type { FileItem } from "../../types";

export function useItem(item: FileItem, index: number) {
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    // transform,
    isDragging,
  } = useDraggable({
    id: item.id,
    data: { item },
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: item.id,
    disabled: item.type !== "folder",
  });

  const [
    isFocused,
    isSelected,
    isGlobalDragging,
    registerItemRef,
    onClick,
    onDoubleClick,
    setFocusedIndex,
  ] = useStore(
    useShallow((s) => [
      s.focusedIndex === index,
      s.selectedItems.has(item.id),
      s.draggedItems.length > 0,
      s.registerItemRef,
      s.handleItemClick,
      s.handleItemDoubleClick,
      s.setFocusedIndex,
    ]),
  );

  const combinedRef = useCallback(
    (element: HTMLDivElement | null) => {
      setDragRef(element);
      setDropRef(element);
      registerItemRef(element);
    },
    [registerItemRef, setDragRef, setDropRef],
  );

  // const style = transform
  //   ? {
  //       transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  //     }
  //   : undefined;

  return {
    isFocused,
    isSelected,
    isDragging,
    isOver,
    attributes,
    listeners,
    isGlobalDragging,
    setFocusedIndex,
    onClick,
    onDoubleClick,
    combinedRef,
  };
}
