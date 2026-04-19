import { FolderPlus, Upload } from "lucide-react";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { useStore } from "../../store";

export function EmptyContextMenu() {
  const openDialog = useStore((s) => s.openDialog);

  return (
    <>
      <ContextMenuItem onClick={() => openDialog({ type: "newFolder" })}>
        <FolderPlus className="mr-2 h-4 w-4" />
        New Folder
      </ContextMenuItem>

      <ContextMenuItem>
        <Upload className="mr-2 h-4 w-4" />
        Upload Files
      </ContextMenuItem>
    </>
  );
}
