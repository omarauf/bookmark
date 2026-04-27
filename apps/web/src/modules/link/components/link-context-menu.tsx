import type { Link } from "@workspace/contracts/link";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { DeleteLinksDialog } from "../dialogs/delete-dialog";
import { EditLinkDialog } from "../dialogs/edit-dialog";
import { useRefreshPreview } from "../hooks/use-link-mutations";

type FolderItem = {
  type: "folder";
  name: string;
  path: string;
};

type LinkItem = {
  type: "link";
  link: Link;
};

type ContextItem = FolderItem | LinkItem;

type Props = {
  item: ContextItem;
  children: React.ReactNode;
};

export function LinkContextMenu({ item, children }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const refreshPreview = useRefreshPreview();

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          {item.type === "link" && (
            <ContextMenuItem onClick={() => setEditOpen(true)}>Edit</ContextMenuItem>
          )}
          {item.type === "link" && (
            <ContextMenuItem
              disabled={refreshPreview.isPending}
              onClick={() => refreshPreview.mutate({ id: item.link.id })}
            >
              Refresh Preview
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {item.type === "link" && (
        <EditLinkDialog
          link={item.link}
          showTrigger={false}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}

      {item.type === "link" && (
        <DeleteLinksDialog
          linkIds={[item.link.id]}
          showTrigger={false}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        />
      )}
    </>
  );
}
