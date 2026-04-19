import { Copy, Download, Edit, FolderPlus, Info, Move, Scissors, Trash2 } from "lucide-react";
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { useStore } from "../../store";

type Props = {
  itemId: string;
};

export function SingleContextMenu({ itemId }: Props) {
  const openDialog = useStore((s) => s.openDialog);

  const item = useStore((s) => s.selectedItemsData.get(itemId));

  if (item === undefined) {
    console.warn(`Item with ID ${itemId} not found in store.`);
    return null;
  }

  return (
    <>
      <ContextMenuItem>
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </ContextMenuItem>

      <ContextMenuItem>
        <Scissors className="mr-2 h-4 w-4" />
        Cut
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem>
        <Download className="mr-2 h-4 w-4" />
        Download
      </ContextMenuItem>

      <ContextMenuItem onClick={() => openDialog({ type: "move", itemIds: [itemId] })}>
        <Move className="mr-2 h-4 w-4" />
        Move to...
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem
        onClick={() =>
          openDialog({ type: item.type === "folder" ? "rename-folder" : "rename-file", item })
        }
      >
        <Edit className="mr-2 h-4 w-4" />
        Rename
        <ContextMenuShortcut>F2</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuItem
        className="text-destructive focus:text-destructive"
        onClick={() => openDialog({ type: "delete", itemIds: [itemId] })}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem onClick={() => openDialog({ type: "newFolder" })}>
        <FolderPlus className="mr-2 h-4 w-4" />
        New Folder
      </ContextMenuItem>

      <ContextMenuItem onClick={() => openDialog({ type: "properties", itemId })}>
        <Info className="mr-2 h-4 w-4" />
        Properties
      </ContextMenuItem>
    </>
  );
}
