import { useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useStore } from "../store";
import type { DialogState } from "../store/slices/dialog-slice";
import { DeleteDialog } from "./delete";
import { MoveDialog } from "./move";
import { NewFolderDialog } from "./new-folder";
import { PropertiesDialog } from "./properties";
import { RenameDialog } from "./rename";

import { UploadDialog } from "./upload";

export function DialogRenderer() {
  const dialog = useStore((s) => s.dialog);
  const closeDialog = useStore((s) => s.closeDialog);

  const lastDialogRef = useRef<DialogState | null>(null);
  if (dialog !== null) {
    lastDialogRef.current = dialog;
  }

  const activeDialog = dialog ?? lastDialogRef.current;

  const onOpenChangeHandler = (open: boolean) => {
    if (!open) closeDialog();
  };

  return (
    <Dialog open={dialog !== null} onOpenChange={onOpenChangeHandler}>
      {activeDialog && <DialogContent dialog={activeDialog} onClose={closeDialog} />}
    </Dialog>
  );
}

function DialogContent({ dialog, onClose }: { dialog: DialogState; onClose: () => void }) {
  switch (dialog.type) {
    case "rename":
      return <RenameDialog onClose={onClose} />;

    case "newFolder":
      return <NewFolderDialog onClose={onClose} />;

    case "properties":
      return <PropertiesDialog />;

    case "delete":
      return <DeleteDialog onClose={onClose} />;

    case "move":
      return <MoveDialog onClose={onClose} />;

    case "upload":
      return <UploadDialog onClose={onClose} />;

    default:
      return null;
  }
}
