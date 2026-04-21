import { useItems } from "../../hooks/use-items";
import { useKeyboardHandler } from "../../hooks/use-keyboard-handler";
import { useStore } from "../../store";
import { FileContextMenu } from "../context-menu";
import { DragSelectionArea } from "./drag-selection-area";
import { ItemsView } from "./items-view";

export function FolderContent() {
  const { items } = useItems();
  const orderedIds = items.map((item) => item.id);

  const containerRef = useStore((s) => s.containerRef);

  useKeyboardHandler(orderedIds);

  return (
    <FileContextMenu>
      <div className="flex h-full flex-col overflow-auto" ref={containerRef}>
        <DragSelectionArea>
          <ItemsView items={items} />
        </DragSelectionArea>
      </div>
    </FileContextMenu>
  );
}
