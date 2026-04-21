import { useSearch } from "@tanstack/react-router";
import { ClipboardPaste, Copy, Download, Move, Scissors, Trash2 } from "lucide-react";
import { ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu";
import { useClipboardPaste } from "../../hooks/use-clipboard-paste";
import { useStore } from "../../store";

type Props = {
  itemIds: string[];
};

export function MultipleContextMenu({ itemIds }: Props) {
  const openDialog = useStore((s) => s.openDialog);
  const cutItems = useStore((s) => s.cutItems);
  const clipboard = useStore((s) => s.clipboard);

  const currentFolderId = useSearch({
    from: "/_authenticated/file-manager/",
    select: (s) => s.folderId,
  });

  const { handlePaste } = useClipboardPaste();

  return (
    <>
      <ContextMenuItem disabled>
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </ContextMenuItem>

      <ContextMenuItem onClick={() => cutItems(new Set(itemIds), currentFolderId)}>
        <Scissors className="mr-2 h-4 w-4" />
        Cut
      </ContextMenuItem>

      <ContextMenuItem onClick={() => handlePaste()} disabled={!clipboard}>
        <ClipboardPaste className="mr-2 h-4 w-4" />
        Paste
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
