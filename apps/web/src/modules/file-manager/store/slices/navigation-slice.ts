import type { StateCreator } from "zustand";
import type { FileItem } from "../../types";
import { findIndexById, findItemById } from "../../utils/file-utils";
import type { StoreState } from "../type";

export type NavigationSlice = {
  currentFolderId: string;
  expandedFolders: Set<string>;

  handleFolderChange: (folderId: string, focusedIndex?: number) => void;
  handleToggleExpanded: (folderId: string) => void;
  handleItemDoubleClick: (item: FileItem) => void;
  handleKeyNavigation: (event: KeyboardEvent) => void;
};

export const createNavigationSlice: StateCreator<StoreState, [], [], NavigationSlice> = (
  set,
  get,
) => ({
  currentFolderId: "root",
  expandedFolders: new Set(["root"]),

  handleFolderChange: (folderId, focusedIndex) => {
    const { containerRef } = get();
    set({
      currentFolderId: folderId,
      focusedIndex: focusedIndex ?? 0,
      selectedItems: new Set(),
    });
    containerRef.current?.focus();
  },

  handleToggleExpanded: (folderId) => {
    const { expandedFolders } = get();
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    set({ expandedFolders: newExpanded });
  },

  handleItemDoubleClick: (item) => {
    if (item.type === "folder") {
      const { handleFolderChange } = get();
      handleFolderChange(item.id);
    }
    // For files, could trigger download or preview
  },

  handleKeyNavigation: (event) => {
    const {
      columns,
      containerRef,
      itemRefs,
      fileTree,
      currentFolderId,
      focusedIndex,
      selectedItems,
      viewMode,
    } = get();

    if (!containerRef.current?.contains(document.activeElement)) return;

    const { key, ctrlKey, metaKey, shiftKey } = event;
    const isMultiSelect = ctrlKey || metaKey;

    // TODO: idea to move the items to state in the store
    const currentFolder = findItemById(fileTree, currentFolderId);
    const items = currentFolder?.children || [];
    switch (key) {
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        // const column = focusedIndex % columns;

        const row = Math.floor(focusedIndex / columns);
        const isFirstRow = row === 0;
        const isLastRow = row === Math.floor((items.length - 1) / columns);

        if (isFirstRow && key === "ArrowUp") return;
        if (isLastRow && key === "ArrowDown") return;

        const direction = key === "ArrowUp" ? -1 : 1;
        const jump = viewMode === "grid" ? columns : 1;
        const moveBy = direction * jump;

        const newIndex = Math.max(0, Math.min(items.length - 1, focusedIndex + moveBy));

        set({ focusedIndex: newIndex });

        // Focus the item element
        const item = items[newIndex];
        if (item) {
          const element = itemRefs.get(item.id);
          element?.focus();

          // Handle selection with Shift key
          if (shiftKey) {
            const newSelection = new Set(selectedItems);
            const newItem = items[newIndex];

            if (newSelection.has(newItem.id)) {
              const betweenItems = items.slice(
                Math.min(focusedIndex, newIndex),
                Math.max(focusedIndex, newIndex) + 1,
              );
              betweenItems.forEach((it) => {
                newSelection.delete(it.id);
              });
            } else {
              const betweenItems = items.slice(
                Math.min(focusedIndex, newIndex),
                Math.max(focusedIndex, newIndex) + 1,
              );
              betweenItems.forEach((it) => {
                newSelection.add(it.id);
              });
            }

            set({ selectedItems: newSelection });
          } else if (!isMultiSelect) {
            set({ selectedItems: new Set() });
          }
        }
        break;
      }

      case "ArrowLeft":
      case "ArrowRight": {
        if (viewMode === "grid") {
          event.preventDefault();
          const direction = key === "ArrowLeft" ? -1 : 1;
          const newIndex = Math.max(0, Math.min(items.length - 1, focusedIndex + direction));
          const lastItem = items.length - 1;

          if (focusedIndex === 0 && key === "ArrowLeft") return;
          if (focusedIndex === lastItem && key === "ArrowRight") return;

          set({ focusedIndex: newIndex });

          const item = items[newIndex];
          if (item) {
            const element = itemRefs.get(item.id);
            element?.focus();

            if (shiftKey) {
              const newSelection = new Set(selectedItems);
              const currentItem = items[focusedIndex];
              const newItem = items[newIndex];

              if (newSelection.has(newItem.id)) {
                newSelection.delete(currentItem.id);
                newSelection.delete(newItem.id);
              } else {
                newSelection.add(currentItem.id);
                newSelection.add(newItem.id);
              }

              set({ selectedItems: newSelection });
            } else if (!isMultiSelect) {
              set({ selectedItems: new Set() });
            }
          }
        }
        break;
      }

      case "Enter": {
        event.preventDefault();
        const item = items[focusedIndex];
        if (item) {
          if (item.type === "folder") {
            const { handleFolderChange } = get();
            handleFolderChange(item.id);
          }
        }
        break;
      }

      case " ": {
        event.preventDefault();
        const item = items[focusedIndex];
        if (item) {
          const newSelection = new Set(selectedItems);
          if (newSelection.has(item.id)) {
            newSelection.delete(item.id);
          } else {
            newSelection.add(item.id);
          }
          set({ selectedItems: newSelection });
        }
        break;
      }

      case "Backspace": {
        event.preventDefault();
        // Navigate to parent folder
        const parentFolder = findItemById(fileTree, currentFolder?.parentId || "root");
        if (parentFolder && parentFolder.id !== currentFolderId) {
          const { handleFolderChange } = get();
          const parentFolderIndex = findIndexById(parentFolder, currentFolderId);
          handleFolderChange(parentFolder.id, parentFolderIndex);
        }
        break;
      }

      case "a":
        if (isMultiSelect) {
          event.preventDefault();
          set({ selectedItems: new Set(items.map((item) => item.id)) });
        }
        break;

      case "Escape":
        event.preventDefault();
        set({ selectedItems: new Set() });
        break;

      default:
        break;
    }
  },
});
