import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useNavigate } from "@tanstack/react-router";
import type { BrowseItem } from "@workspace/contracts/file-manager";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { useStore } from "../store";

export function useItem(item: BrowseItem, index: number) {
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
  const navigate = useNavigate();

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: item.id,
    disabled: item.type !== "folder",
  });

  const [
    isFocused,
    isSelected,
    isGlobalDragging,
    registerItemRef,
    setFocusedIndex,
    selectItemRange,
    toggleSelectedItem,
    selectSingleItem,
  ] = useStore(
    useShallow((s) => [
      s.focusedIndex === index,
      s.selectedItems.has(item.id),
      s.draggedItems.length > 0,
      s.registerItemRef,
      s.setFocusedIndex,
      s.selectItemRange,
      s.toggleSelectedItem,
      s.selectSingleItem,
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

  const onDoubleClick = useCallback(
    (item: BrowseItem) => {
      if (item.type === "folder") {
        navigate({ to: ".", search: (s) => ({ ...s, folderId: item.id }) });
      }
    },
    [navigate],
  );

  const onClick = useCallback(
    (itemId: string, orderedIds: string[], index: number, event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();

      const isRangeSelect = event.shiftKey;
      const isMultiSelect = event.ctrlKey || event.metaKey;

      if (isRangeSelect) {
        selectItemRange(orderedIds, index);
        return;
      }

      if (isMultiSelect) {
        toggleSelectedItem(itemId, index);
        return;
      }
      selectSingleItem(itemId, index);
    },
    [selectItemRange, toggleSelectedItem, selectSingleItem],
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
