import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DndContext, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { orpc } from "@/api/rpc";
import { useLinkDragStore } from "../hooks/store";

export function LinkDragContext({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const [selectedIds, clearSelection, setIsGlobalDragging, setActiveId, setIsManualSelecting] =
    useLinkDragStore(
      useShallow((s) => [
        s.selectedIds,
        s.clearSelection,
        s.setIsGlobalDragging,
        s.setActiveId,
        s.setIsManualSelecting,
      ]),
    );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsGlobalDragging(true);
  };

  const movesMutation = useMutation(
    orpc.links.move.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.links.tree.key() });
        clearSelection();
        toast.success("Link moved successfully!");
      },
      onError: () => {
        toast.error("Failed to move link.");
      },
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(undefined);
      setIsGlobalDragging(false);
      return;
    }

    // If dropped on a folder, move the link
    if (over.id.toString().startsWith("folder-")) {
      const targetFolderPath = over.id.toString().replace("folder-", "");
      const linkId = active.id as string;

      if (selectedIds.size > 1) {
        movesMutation.mutate({ ids: Array.from(selectedIds), path: targetFolderPath });
      } else {
        movesMutation.mutate({ ids: [linkId], path: targetFolderPath });
      }
    }

    setIsGlobalDragging(false);

    setActiveId(undefined);
  };

  const handleDragCancel = () => {
    setActiveId(undefined);
    setIsGlobalDragging(false);
  };

  useEffect(() => {
    const controller = new AbortController();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        setIsManualSelecting(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey) {
        setIsManualSelecting(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown, { signal: controller.signal });
    document.addEventListener("keyup", handleKeyUp, { signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [setIsManualSelecting]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
    </DndContext>
  );
}
