import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "sonner";
import { orpc } from "@/api/rpc";

interface Props {
  link: Link;
  open: boolean;
  onClose: VoidFunction;
}

export function LinkDeleteDialog({ link, open, onClose }: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    orpc.links.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.links.tree.key() });
        queryClient.invalidateQueries({ queryKey: orpc.links.list.key() });
        onClose();
        toast.success("Link deleted successfully!");
      },
      onError: () => {
        toast.error("Failed to delete link.");
      },
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{link?.title || link?.url}"? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate({ ids: [link.id] })}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
