import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { orpc } from "@/integrations/orpc";
import { useStore } from "../store";

type Props = {
  onClose: () => void;
  itemIds: string[];
};

export function DeleteDialog({ onClose, itemIds }: Props) {
  const queryClient = useQueryClient();
  const setSelectedItems = useStore((s) => s.setSelectedItems);

  const deleteMutation = useMutation(orpc.file.bulkDelete.mutationOptions());
  const isSingle = itemIds.length === 1;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ ids: itemIds });
      setSelectedItems(new Set());
      queryClient.invalidateQueries({ queryKey: orpc.browse.list.key() });
      queryClient.invalidateQueries({ queryKey: orpc.folder.tree.key() });
      onClose();
    } catch (error) {
      console.error("Failed to delete items", error);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{isSingle ? "Delete item" : `Delete ${itemIds.length} items`}</DialogTitle>
        <DialogDescription>
          {isSingle
            ? "Are you sure you want to delete this item? This action cannot be undone."
            : `Are you sure you want to delete ${itemIds.length} items? This action cannot be undone.`}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={deleteMutation.isPending}>
            Cancel
          </Button>
        </DialogClose>

        <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
