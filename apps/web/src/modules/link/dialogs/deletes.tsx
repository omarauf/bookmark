import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { useLinkDragStore } from "../hooks/store";

interface Props {
  open: boolean;
  onClose: VoidFunction;
}

export function LinksDeleteDialog({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const selectedIds = useLinkDragStore((s) => s.selectedIds);

  const deleteMutation = useMutation(
    orpc.link.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.link.tree.key() });
        queryClient.invalidateQueries({ queryKey: orpc.link.list.key() });
        onClose();
        toast.success("Links deleted successfully!");
      },
      onError: () => {
        toast.error("Failed to delete links.");
      },
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{selectedIds.size}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate({ ids: Array.from(selectedIds) })}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
