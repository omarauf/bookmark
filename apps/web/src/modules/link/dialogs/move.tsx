import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Link } from "@workspace/contracts/link";
import React from "react";
import { toast } from "sonner";
import { FolderTree } from "@/components/folder-tree";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { orpc } from "@/integrations/orpc";

interface Props {
  link: Link;
  open: boolean;
  onClose: VoidFunction;
}

export function LinkMoveDialog({ link, open, onClose }: Props) {
  const { data } = useQuery(orpc.link.folders.queryOptions());
  const queryClient = useQueryClient();
  const [selectedFolder, setSelectedFolder] = React.useState(link.path);

  const mutation = useMutation(
    orpc.link.move.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.link.tree.key() });
        queryClient.invalidateQueries({ queryKey: orpc.link.list.key() });
        onClose();
        setSelectedFolder("");
        toast.success("Link moved successfully!");
      },
      onError: () => {
        toast.error("Failed to move link.");
      },
    }),
  );

  const handleMoveConfirm = () => {
    if (selectedFolder === link.path) {
      toast.error("Please select a different folder.");
      return;
    }
    mutation.mutate({ ids: [link.id], path: selectedFolder });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Link</DialogTitle>
          <DialogDescription>
            Select a destination folder for "{link?.title || link?.url}".
          </DialogDescription>
        </DialogHeader>

        {data && (
          <FolderTree initialData={data} selected={selectedFolder} onSelect={setSelectedFolder} />
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleMoveConfirm} disabled={selectedFolder === undefined}>
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
