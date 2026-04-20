import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useItems } from "../../hooks/use-items";
import { useKeyboardHandler } from "../../hooks/use-keyboard-handler";
import { useSyncGridColumns } from "../../hooks/use-sync-grid-columns";
import { useStore } from "../../store";
import { FileContextMenu } from "../context-menu";
import { FileGridItem } from "../item/grid-item";
import { FileListItem } from "../item/list-item";
import { DragSelectionArea } from "./drag-selection-area";

export function FolderContent() {
  const viewMode = useStore((s) => s.viewMode);

  const { items } = useItems();
  const orderedIds = items.map((item) => item.id);

  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useStore((s) => s.containerRef);

  useSyncGridColumns(gridRef);
  useKeyboardHandler(orderedIds);

  if (items.length === 0) {
    return (
      <div className="col-span-full flex items-center justify-center py-12 text-muted-foreground">
        This folder is empty
      </div>
    );
  }

  return (
    <FileContextMenu>
      <div className="flex h-full flex-col overflow-auto" ref={containerRef}>
        <DragSelectionArea>
          <div
            ref={gridRef}
            className={cn(
              "relative h-full p-4",
              viewMode === "grid"
                ? "grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] content-start gap-4"
                : "space-y-1",
            )}
          >
            {items.map((item, index) =>
              viewMode === "grid" ? (
                <FileGridItem key={item.id} item={item} orderedIds={orderedIds} index={index} />
              ) : (
                <FileListItem key={item.id} item={item} orderedIds={orderedIds} index={index} />
              ),
            )}
          </div>
        </DragSelectionArea>
      </div>
    </FileContextMenu>
  );
}
