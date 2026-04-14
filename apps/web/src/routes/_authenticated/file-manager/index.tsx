import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { useShallow } from "zustand/shallow";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { DragPreview } from "@/modules/file-manger/components/drag-preview";
import { FolderContent } from "@/modules/file-manger/components/folder/folder-content";
import { Toolbar } from "@/modules/file-manger/components/toolbar";
import { FileTree } from "@/modules/file-manger/components/tree";
import { NewFolderDialog } from "@/modules/file-manger/dialogs/new-folder";
import { PropertiesDialog } from "@/modules/file-manger/dialogs/properties";
import { RenameDialog } from "@/modules/file-manger/dialogs/rename";
import { useDebounce } from "@/modules/file-manger/hooks/use-debounce";
import { useStore } from "@/modules/file-manger/store";

export const Route = createFileRoute("/_authenticated/file-manager/")({
  component: RouteComponent,
});

function RouteComponent() {
  const fileManagerRef = useRef<HTMLDivElement>(null);

  const [treeWidth, setTreeWidth, handleDragStart, handleDragEnd] = useStore(
    useShallow((s) => [s.treeWidth, s.setTreeWidth, s.handleDragStart, s.handleDragEnd]),
  );

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
      // collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={fileManagerRef}
        className="h-full w-full bg-background"
        style={{ display: "grid", gridTemplateRows: "auto 1fr" }}
        tabIndex={-1}
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
            <FolderContent />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <DragOverlay>
        <DragPreview />
      </DragOverlay>

      {/* Dialogs */}
      <RenameDialog />

      <NewFolderDialog />

      <PropertiesDialog />
    </DndContext>
  );
}
