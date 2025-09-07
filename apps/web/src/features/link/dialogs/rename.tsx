import type { Link } from "@workspace/contracts/link";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import React from "react";

interface Props {
  link: Link;
  open: boolean;
  onClose: VoidFunction;
}

export function LinkRenameDialog({ link, open, onClose }: Props) {
  const [newTitle, setNewTitle] = React.useState("");

  const handleRenameConfirm = () => {
    // TODO: Implement API call to rename link
    console.log(`Renaming link ${link._id} to "${newTitle}"`);
    // await renameLink(selectedLink._id, newTitle);
    onClose();
    setNewTitle("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Link</DialogTitle>
          <DialogDescription>Enter a new title for this link.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleRenameConfirm();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleRenameConfirm}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
