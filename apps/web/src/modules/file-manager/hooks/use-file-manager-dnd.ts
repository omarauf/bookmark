import type { DragCancelEvent, DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { orpc } from "@/integrations/orpc";
import { getError } from "@/utils/error";
import { useStore } from "../store";

export function useFileManagerDnd() {
  const currentFolderId = useSearch({
    from: "/_authenticated/file-manager/",
    select: (s) => s.folderId,
  });

  const queryClient = useQueryClient();
  const moveMutation = useMutation(orpc.browse.move.mutationOptions());
  // const moveFolderMutation = useMutation(orpc.folder.move.mutationOptions());

  const [isDragging, startDrag, updateDropTarget, clearDragState] = useStore(
    useShallow((s) => [s.isDragging, s.startDrag, s.updateDropTarget, s.clearDragState]),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const keyboardLikeEvent = event.activatorEvent as { ctrlKey?: boolean; metaKey?: boolean };
      const isCopy = Boolean(keyboardLikeEvent.ctrlKey || keyboardLikeEvent.metaKey);

      const activeId = String(event.active.id);
      startDrag(activeId, currentFolderId, isCopy);
    },
    [currentFolderId, startDrag],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const nextDropTarget = getValidTargetFolderId(event.over);
      updateDropTarget(nextDropTarget);
    },
    [updateDropTarget],
  );

  const handleDragCancel = useCallback(
    (_event: DragCancelEvent) => clearDragState(),
    [clearDragState],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const operation = useStore.getState().dropOperation;

      if (operation === "copy") {
        toast.error("Copy operation is not supported yet");
        useStore.getState().clearDragState();
        return;
      }

      const targetFolderId = getValidTargetFolderId(event.over);
      const { selectedItems, dragSourceFolderId } = useStore.getState();

      if (targetFolderId === undefined) return;

      try {
        await moveMutation.mutateAsync({
          itemIds: Array.from(selectedItems),
          sourceFolderId: dragSourceFolderId,
          targetFolderId,
        });

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: orpc.browse.list.key() }),
          queryClient.invalidateQueries({ queryKey: orpc.folder.tree.key() }),
        ]);

        const count = selectedItems.size;
        toast.success(`Items moved successfully (${count})`);
      } catch (error) {
        const msg = getError(error, "Failed to move items");
        toast.error(msg);
      } finally {
        useStore.getState().clearDragState();
      }
    },
    [moveMutation, queryClient],
  );

  useEffect(() => {
    if (!isDragging) return;

    const updateOperation = (event: KeyboardEvent) => {
      const nextOperation = event.ctrlKey || event.metaKey ? "copy" : "move";
      useStore.getState().setDropOperation(nextOperation);
    };

    const resetOperation = () => {
      useStore.getState().setDropOperation("move");
    };

    document.addEventListener("keydown", updateOperation);
    document.addEventListener("keyup", updateOperation);
    window.addEventListener("blur", resetOperation);

    return () => {
      document.removeEventListener("keydown", updateOperation);
      document.removeEventListener("keyup", updateOperation);
      window.removeEventListener("blur", resetOperation);
    };
  }, [isDragging]);

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}

function getValidTargetFolderId(over: DragOverEvent["over"] | DragEndEvent["over"]) {
  if (!over) return undefined;

  if (typeof over.id !== "string") return undefined;

  const targetFolderId = over.id;

  const { selectedItems } = useStore.getState();
  if (selectedItems.size === 0) return undefined;

  for (const item of selectedItems) {
    // check if the target folder is the same as any of the dragged items (which can happen when dragging multiple items and hovering over one of the dragged items) or if the target folder the same as dragged folder
    if (targetFolderId === item) {
      return undefined;
    }
  }

  return targetFolderId;
}
