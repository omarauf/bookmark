import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { StateCreator } from "zustand";
import type { FileItem } from "../../types";
import type { StoreState } from "../type";

export type DndSlice = {
  draggedItems: FileItem[];

  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
};

export const createDndSlice: StateCreator<StoreState, [], [], DndSlice> = () => ({
  draggedItems: [],

  handleDragStart: () => {
    // const { selectedItems, fileTree } = get();
    // const draggedId = event.active.id as string;
    // let draggedItems: FileItem[] = [];
    // if (selectedItems.has(draggedId)) {
    //   // Dragging multiple selected items
    //   draggedItems = Array.from(selectedItems)
    //     .map((id) => findItemById(fileTree, id))
    //     .filter(Boolean) as FileItem[];
    // } else {
    //   // Dragging single item
    //   const item = findItemById(fileTree, draggedId);
    //   if (item) {
    //     draggedItems = [item];
    //   }
    // }
    // set({ draggedItems });
  },

  handleDragEnd: async () => {
    return; // Disable DnD for now, as we need to implement move API and handle edge cases like moving folder into its own descendant
    // const { active, over } = event;
    // const { fileTree, draggedItems } = get();

    // if (!over || !active) {
    //   set({ draggedItems: [] });
    //   return;
    // }
    // const sourceId = active.id as string;
    // const targetId = over.id as string;

    // // Find source and target items
    // const sourceItem = findItemById(fileTree, sourceId);
    // const targetItem = findItemById(fileTree, targetId);

    // if (!sourceItem || !targetItem || targetItem.type !== "folder") {
    //   set({ draggedItems: [] });
    //   return;
    // }

    // // Prevent dropping folder into its own descendant
    // if (sourceItem.type === "folder" && isDescendantOf(sourceItem.id, targetId, fileTree)) {
    //   console.error("Invalid operation, Cannot move a folder into its own subfolder");
    //   set({ draggedItems: [] });
    //   return;
    // }

    // // Get items to copy (either selected items or just the dragged item)
    // const itemsToCopy = draggedItems.length > 0 ? draggedItems : [sourceItem];

    // try {
    //   // Simulate copy operation
    //   const result = await mockApi.copyItems(itemsToCopy, targetId);

    //   if (result.success) {
    //     // Update file tree with copied items
    //     const newTree = { ...fileTree };
    //     const targetFolder = findItemById(newTree, targetId);

    //     if (targetFolder?.children) {
    //       const existingNames = targetFolder.children.map((child) => child.name);

    //       // Create copies of items with unique names
    //       const copiedItems = itemsToCopy.map((item) => {
    //         const uniqueName = generateUniqueFileName(item.name, existingNames);
    //         existingNames.push(uniqueName); // Prevent duplicate names in batch

    //         return {
    //           ...item,
    //           id: `${item.id}_copy_${Date.now()}_${Math.random()}`,
    //           name: uniqueName,
    //           parentId: targetId,
    //         };
    //       });

    //       targetFolder.children = [...targetFolder.children, ...copiedItems];
    //     }

    //     set({ fileTree: newTree });

    //     toast.success(result.message);
    //   }
    // } catch (error) {
    //   console.error("Failed to copy items", error);
    //   toast.error("Failed to copy items");
    // }
    // set({ draggedItems: [] });
  },
});
