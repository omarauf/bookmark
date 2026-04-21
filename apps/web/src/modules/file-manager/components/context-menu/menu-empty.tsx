import { ClipboardPaste, FolderPlus, Upload } from "lucide-react";
import { ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu";
import { useClipboardPaste } from "../../hooks/use-clipboard-paste";
import { useStore } from "../../store";

export function EmptyContextMenu() {
  const openDialog = useStore((s) => s.openDialog);
  const clipboard = useStore((s) => s.clipboard);

  const { handlePaste } = useClipboardPaste();

  return (
    <>
      <ContextMenuItem onClick={() => handlePaste()} disabled={!clipboard}>
        <ClipboardPaste className="mr-2 h-4 w-4" />
        Paste
        <span className="ml-auto text-muted-foreground text-xs tracking-widest">Ctrl+V</span>
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem onClick={() => openDialog({ type: "newFolder" })}>
        <FolderPlus className="mr-2 h-4 w-4" />
        New Folder
      </ContextMenuItem>

      <ContextMenuItem onClick={() => openDialog({ type: "upload" })}>
        <Upload className="mr-2 h-4 w-4" />
        Upload Files
      </ContextMenuItem>
    </>
  );
}
