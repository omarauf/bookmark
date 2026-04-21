import { DndContext, PointerSensor, pointerWithin, useSensor, useSensors } from "@dnd-kit/core";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { useShallow } from "zustand/shallow";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { DragPreview } from "@/modules/file-manager/components/drag-preview";
import { FolderBreadcrumb } from "@/modules/file-manager/components/folder/breadcrub";
import { FolderContent } from "@/modules/file-manager/components/folder/folder-content";
import { Toolbar } from "@/modules/file-manager/components/toolbar";
import { FileTree } from "@/modules/file-manager/components/tree";
import { DialogRenderer } from "@/modules/file-manager/dialogs/dialog-renderer";
import { useDebounce } from "@/modules/file-manager/hooks/use-debounce";
import { useFileManagerDnd } from "@/modules/file-manager/hooks/use-file-manager-dnd";
import { useStore } from "@/modules/file-manager/store";

export const Route = createFileRoute("/_authenticated/file-manager/")({
  validateSearch: z.object({
    folderId: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const [treeWidth, setTreeWidth] = useStore(useShallow((s) => [s.treeWidth, s.setTreeWidth]));
  const { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel } = useFileManagerDnd();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const debouncedSetTreeWidth = useDebounce(setTreeWidth, 200);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={pointerWithin}
    >
      <div
        className="h-full w-full border-l bg-background"
        style={{ display: "grid", gridTemplateRows: "auto 1fr" }}
      >
        <Toolbar />

        <ResizablePanelGroup orientation="horizontal" className="flex-1">
          <ResizablePanel
            defaultSize={treeWidth}
            onResize={debouncedSetTreeWidth}
            minSize="20%"
            maxSize="40%"
          >
            <FileTree />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={100 - treeWidth} className="flex flex-col">
            <FolderBreadcrumb />

            <FolderContent />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <DragPreview />

      <DialogRenderer />
    </DndContext>
  );
}
