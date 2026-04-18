import { Copy, Download, Edit, FolderPlus, Info, Scissors, Trash2, Upload } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useStore } from "../store";

interface FileContextMenuProps {
  children: React.ReactNode;
}

export function FileContextMenu({ children }: FileContextMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <ContextMenu onOpenChange={setOpen}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      {open && <Content />}
    </ContextMenu>
  );
}

function Content() {
  const selectedItemIds = useStore(useShallow((s) => Array.from(s.selectedItems)));

  const itemsToAction = selectedItemIds;

  const itemCount = itemsToAction.length;
  const isMultipleItems = itemCount > 1;
  const isSingleItem = itemCount === 1;
  const hasItems = itemCount > 0;

  const onDelete = useStore((s) => s.onDelete);
  const onRename = useStore((s) => s.onRename);
  const onNewFolder = useStore((s) => s.onNewFolder);
  const onProperties = useStore((s) => s.onProperties);

  return (
    <ContextMenuContent className="w-48">
      {!hasItems && (
        <>
          <ContextMenuItem onClick={onNewFolder}>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => toast.success("Upload functionality would be implemented here")}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </ContextMenuItem>
        </>
      )}

      {hasItems && (
        <>
          <ContextMenuItem
            onClick={() => toast.success(`${itemCount} item(s) copied to clipboard`)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy {isMultipleItems ? `${itemCount} items` : ""}
          </ContextMenuItem>

          <ContextMenuItem onClick={() => toast.success(`${itemCount} item(s) cut to clipboard`)}>
            <Scissors className="mr-2 h-4 w-4" />
            Cut {isMultipleItems ? `${itemCount} items` : ""}
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem onClick={() => toast.success(`Downloading ${itemCount} item(s)...`)}>
            <Download className="mr-2 h-4 w-4" />
            Download {isMultipleItems ? `${itemCount} items` : ""}
          </ContextMenuItem>

          <ContextMenuSeparator />

          {isSingleItem && (
            <ContextMenuItem onClick={() => onRename(itemsToAction[0])}>
              <Edit className="mr-2 h-4 w-4" />
              Rename
            </ContextMenuItem>
          )}

          <ContextMenuItem
            onClick={() => onDelete(itemsToAction)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete {isMultipleItems ? `${itemCount} items` : ""}
          </ContextMenuItem>

          {isSingleItem && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => onProperties(itemsToAction[0])}>
                <Info className="mr-2 h-4 w-4" />
                Properties
              </ContextMenuItem>
            </>
          )}
        </>
      )}
    </ContextMenuContent>
  );
}
