import { useNavigate, useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { useStore } from "../store";

export function useFolderNavigation(orderedIds: string[]) {
  const [columns, containerRef, itemRefs, focusedIndex, selectedItems, viewMode] = useStore(
    useShallow((s) => [
      s.columns,
      s.containerRef,
      s.itemRefs,
      s.focusedIndex,
      s.selectedItems,
      s.viewMode,
    ]),
  );

  const navigate = useNavigate({ from: "/file-manager/" });
  const router = useRouter();
  const shiftSelectionAnchorRef = useRef<number | null>(null);

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

          // Focus DOM
          useStore.setState({ focusedIndex: newIndex });
          itemRefs.get(newId)?.focus();

          if (shiftKey) {
            const anchor = shiftSelectionAnchorRef.current ?? focusedIndex;
            shiftSelectionAnchorRef.current = anchor;

            const start = Math.min(anchor, newIndex);
            const end = Math.max(anchor, newIndex);

            const newSelection = new Set<string>();
            for (let i = start; i <= end; i++) {
              newSelection.add(orderedIds[i]);
            }

            useStore.setState({ selectedItems: newSelection });
          } else if (!isMultiSelect) {
            shiftSelectionAnchorRef.current = newIndex;
            useStore.setState({ selectedItems: new Set([newId]) });
          } else {
            shiftSelectionAnchorRef.current = newIndex;
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

          useStore.setState({ focusedIndex: newIndex });
          itemRefs.get(newId)?.focus();

          if (shiftKey) {
            const anchor = shiftSelectionAnchorRef.current ?? focusedIndex;
            shiftSelectionAnchorRef.current = anchor;

            const start = Math.min(anchor, newIndex);
            const end = Math.max(anchor, newIndex);

            const newSelection = new Set<string>();
            for (let i = start; i <= end; i++) {
              newSelection.add(orderedIds[i]);
            }

            useStore.setState({ selectedItems: newSelection });
          } else if (!isMultiSelect) {
            shiftSelectionAnchorRef.current = newIndex;
            useStore.setState({ selectedItems: new Set<string>([newId]) });
          } else {
            shiftSelectionAnchorRef.current = newIndex;
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
          shiftSelectionAnchorRef.current = focusedIndex;

          const currentId = orderedIds[focusedIndex];
          const newSelection = new Set(selectedItems);

          if (newSelection.has(currentId)) {
            newSelection.delete(currentId);
          } else {
            newSelection.add(currentId);
          }

          useStore.setState({ selectedItems: newSelection });
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
            shiftSelectionAnchorRef.current = focusedIndex;
            useStore.setState({ selectedItems: new Set(orderedIds) });
          }
          break;

        case "Escape":
          event.preventDefault();
          shiftSelectionAnchorRef.current = focusedIndex;
          useStore.setState({ selectedItems: new Set() });
          break;
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
    ],
  );

  useEffect(() => {
    document.addEventListener("keydown", navigationHandler);
    return () => {
      document.removeEventListener("keydown", navigationHandler);
    };
  }, [navigationHandler]);
}
