import { Copy, Download, Move, Scissors, Trash2 } from "lucide-react";
import { ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu";
import { useStore } from "../../store";

type Props = {
  itemIds: string[];
};

export function MultipleContextMenu({ itemIds }: Props) {
  const openDialog = useStore((s) => s.openDialog);

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

      <ContextMenuItem onClick={() => openDialog({ type: "move" })}>
        <Move className="mr-2 h-4 w-4" />
        Move to...
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem
        className="text-destructive focus:text-destructive"
        onClick={() => openDialog({ type: "delete" })}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete {itemIds.length} items
      </ContextMenuItem>
    </>
  );
}
