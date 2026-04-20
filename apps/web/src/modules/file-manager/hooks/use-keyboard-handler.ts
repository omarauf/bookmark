import { useNavigate, useRouter } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useStore } from "../store";
import { useItems } from "./use-items";

export function useKeyboardHandler(orderedIds: string[]) {
  const { getItemData } = useItems();

  const [
    columns,
    containerRef,
    itemRefs,
    focusedIndex,
    selectedItems,
    viewMode,
    openDialog,
    setFocusedIndex,
    selectSingleItem,
    selectItemRange,
    toggleFocusedItemSelection,
    selectAllItems,
    clearSelection,
  ] = useStore(
    useShallow((s) => [
      s.columns,
      s.containerRef,
      s.itemRefs,
      s.focusedIndex,
      s.selectedItems,
      s.viewMode,
      s.openDialog,
      s.setFocusedIndex,
      s.selectSingleItem,
      s.selectItemRange,
      s.toggleFocusedItemSelection,
      s.selectAllItems,
      s.clearSelection,
    ]),
  );

  const navigate = useNavigate({ from: "/file-manager/" });
  const router = useRouter();

  const navigationHandler = useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      const { key, ctrlKey, metaKey, shiftKey } = event;
      const isMultiSelect = ctrlKey || metaKey;

      const total = orderedIds.length;
      if (total === 0) return;

      switch (key) {
        case "ArrowUp":
        case "ArrowDown": {
          event.preventDefault();

          const row = Math.floor(focusedIndex / columns);
          const isFirstRow = row === 0;
          const isLastRow = row === Math.floor((total - 1) / columns);

          if (isFirstRow && key === "ArrowUp") return;
          if (isLastRow && key === "ArrowDown") return;

          const direction = key === "ArrowUp" ? -1 : 1;
          const jump = viewMode === "grid" ? columns : 1;

          const newIndex = Math.max(0, Math.min(total - 1, focusedIndex + direction * jump));

          const newId = orderedIds[newIndex];

          setFocusedIndex(newIndex);
          itemRefs.get(newId)?.focus();

          if (shiftKey) {
            selectItemRange(orderedIds, newIndex);
          } else if (!isMultiSelect) {
            selectSingleItem(newId, newIndex);
          }

          break;
        }

        case "ArrowLeft":
        case "ArrowRight": {
          if (viewMode !== "grid") break;

          event.preventDefault();

          const direction = key === "ArrowLeft" ? -1 : 1;

          const newIndex = Math.max(0, Math.min(total - 1, focusedIndex + direction));

          if (newIndex === focusedIndex) return;

          const newId = orderedIds[newIndex];

          setFocusedIndex(newIndex);
          itemRefs.get(newId)?.focus();

          if (shiftKey) {
            selectItemRange(orderedIds, newIndex);
          } else if (!isMultiSelect) {
            selectSingleItem(newId, newIndex);
          }

          break;
        }

        case "Enter": {
          event.preventDefault();
          const currentId = orderedIds[focusedIndex];
          // TODO check if it's a folder
          navigate({ to: "/file-manager", search: { folderId: currentId } });
          containerRef.current?.focus();
          break;
        }

        case " ": {
          event.preventDefault();
          toggleFocusedItemSelection(orderedIds);
          break;
        }

        case "Backspace": {
          event.preventDefault();
          router.history.back();
          break;
        }

        case "a":
          if (isMultiSelect) {
            event.preventDefault();
            selectAllItems(orderedIds);
          }
          break;

        case "Escape":
          event.preventDefault();
          clearSelection();
          break;

        case "F2": {
          event.preventDefault();
          if (selectedItems.size !== 1) return;
          const [itemId] = selectedItems;
          const item = getItemData(itemId);
          if (!item) return;
          openDialog({ type: item.type === "folder" ? "rename-folder" : "rename-file", item });
          break;
        }
      }
    },
    [
      columns,
      containerRef,
      focusedIndex,
      itemRefs,
      navigate,
      orderedIds,
      selectedItems,
      viewMode,
      router,
      openDialog,
      setFocusedIndex,
      selectSingleItem,
      selectItemRange,
      toggleFocusedItemSelection,
      selectAllItems,
      clearSelection,
      getItemData,
    ],
  );

  useEffect(() => {
    document.addEventListener("keydown", navigationHandler);
    return () => {
      document.removeEventListener("keydown", navigationHandler);
    };
  }, [navigationHandler]);
}
