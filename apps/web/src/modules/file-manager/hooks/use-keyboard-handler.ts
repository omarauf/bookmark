import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useStore } from "../store";
import { useClipboardPaste } from "./use-clipboard-paste";

export function useKeyboardHandler(orderedIds: string[]) {
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
    clipboard,
    cutItems,
    clearClipboard,
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
      s.clipboard,
      s.cutItems,
      s.clearClipboard,
    ]),
  );

  const currentFolderId = useSearch({
    from: "/_authenticated/file-manager/",
    select: (s) => s.folderId,
  });

  const navigate = useNavigate({ from: "/file-manager/" });
  const router = useRouter();
  const { handlePaste } = useClipboardPaste();

  const navigationHandler = useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      const { key, ctrlKey, metaKey, shiftKey } = event;
      const isMultiSelect = ctrlKey || metaKey;

      const total = orderedIds.length;
      if (total === 0 && key !== "Escape" && !isMultiSelect) return;

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

        case "x":
          if (!isMultiSelect) return;
          event.preventDefault();
          if (selectedItems.size === 0) return;
          cutItems(selectedItems, currentFolderId);
          break;

        case "v":
          if (!isMultiSelect) return;
          event.preventDefault();
          if (!clipboard) return;
          handlePaste();
          break;

        case "a":
          if (isMultiSelect) {
            event.preventDefault();
            selectAllItems(orderedIds);
          }
          break;

        case "Escape":
          event.preventDefault();
          clearClipboard();
          clearSelection();
          break;

        case "F2": {
          event.preventDefault();
          if (selectedItems.size !== 1) return;
          openDialog({ type: "rename" });
          break;
        }

        case "Delete": {
          event.preventDefault();
          if (selectedItems.size === 0) return;
          openDialog({ type: "delete" });
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
      clipboard,
      cutItems,
      clearClipboard,
      currentFolderId,
      handlePaste,
    ],
  );

  useEffect(() => {
    document.addEventListener("keydown", navigationHandler);
    return () => {
      document.removeEventListener("keydown", navigationHandler);
    };
  }, [navigationHandler]);
}
