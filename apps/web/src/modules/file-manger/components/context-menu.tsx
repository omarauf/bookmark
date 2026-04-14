import { Copy, Download, Edit, FolderPlus, Info, Scissors, Trash2, Upload } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useStore } from "../store";
import type { FileItem } from "../types";
import { findItemById } from "../utils/file-utils";

interface FileContextMenuProps {
  children: React.ReactNode;
  item?: FileItem;
}

export function FileContextMenu({ children, item }: FileContextMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <ContextMenu onOpenChange={setOpen}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      {open && <Content item={item} />}
    </ContextMenu>
  );
}

function Content({ item }: { item?: FileItem }) {
  const selectedItems = useStore(
    useShallow(
      (s) =>
        Array.from(s.selectedItems)
          .map((id) => findItemById(s.fileTree, id))
          .filter(Boolean) as FileItem[],
    ),
  );

  const itemsToAction =
    item && selectedItems.some((selected) => selected.id === item.id)
      ? selectedItems
      : item
        ? [item]
        : [];

  const isMultipleItems = itemsToAction.length > 1;
  const isSingleItem = itemsToAction.length === 1;
  const hasItems = itemsToAction.length > 0;

  const onCopy = useStore((s) => s.onCopy);
  const onMove = useStore((s) => s.onMove);
  const onDelete = useStore((s) => s.onDelete);
  const onRename = useStore((s) => s.onRename);
  const onDownload = useStore((s) => s.onDownload);
  const onNewFolder = useStore((s) => s.onNewFolder);
  const onUpload = useStore((s) => s.onUpload);
  const onProperties = useStore((s) => s.onProperties);

  return (
    <ContextMenuContent className="w-48">
      {!hasItems && (
        <>
          <ContextMenuItem onClick={onNewFolder}>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </ContextMenuItem>
          <ContextMenuItem onClick={onUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </ContextMenuItem>
        </>
      )}

      {hasItems && (
        <>
          <ContextMenuItem onClick={() => onCopy(itemsToAction)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy {isMultipleItems ? `${itemsToAction.length} items` : ""}
          </ContextMenuItem>

          <ContextMenuItem onClick={() => onMove(itemsToAction)}>
            <Scissors className="mr-2 h-4 w-4" />
            Cut {isMultipleItems ? `${itemsToAction.length} items` : ""}
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem onClick={() => onDownload(itemsToAction)}>
            <Download className="mr-2 h-4 w-4" />
            Download {isMultipleItems ? `${itemsToAction.length} items` : ""}
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
            Delete {isMultipleItems ? `${itemsToAction.length} items` : ""}
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
