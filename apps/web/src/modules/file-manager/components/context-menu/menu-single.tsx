import { Copy, Download, Edit, Info, Move, Scissors, Trash2 } from "lucide-react";
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { useItems } from "../../hooks/use-items";
import { useStore } from "../../store";

type Props = {
  itemId: string;
};

export function SingleContextMenu({ itemId }: Props) {
  const openDialog = useStore((s) => s.openDialog);

  const { getItemData } = useItems();

  const item = getItemData(itemId);
  if (item === undefined) {
    console.warn(`Item with ID ${itemId} not found in store.`);
    return null;
  }

  return (
    <>
      <ContextMenuItem>
        <Copy className="mr-2 h-4 w-4" />
        Copy
        <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuItem>
        <Scissors className="mr-2 h-4 w-4" />
        Cut
        <ContextMenuShortcut>Ctrl+X</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem>
        <Download className="mr-2 h-4 w-4" />
        Download
      </ContextMenuItem>

      <ContextMenuItem onClick={() => openDialog({ type: "move" })}>
        <Move className="mr-2 h-4 w-4" />
        Move to...
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem onClick={() => openDialog({ type: "rename" })}>
        <Edit className="mr-2 h-4 w-4" />
        Rename
        <ContextMenuShortcut>F2</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuItem
        className="text-destructive focus:text-destructive"
        onClick={() => openDialog({ type: "delete" })}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem onClick={() => openDialog({ type: "properties" })}>
        <Info className="mr-2 h-4 w-4" />
        Properties
      </ContextMenuItem>
    </>
  );
}
