import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { getError } from "@/utils/error";
import { useItems } from "../hooks/use-items";
import { useStore } from "../store";

type Props = {
  onClose: () => void;
};

export function DeleteDialog({ onClose }: Props) {
  const queryClient = useQueryClient();
  const selectedItems = useStore((s) => s.selectedItems);
  const setSelectedItems = useStore((s) => s.setSelectedItems);
  const { getItemData } = useItems();

  const items = [...selectedItems]
    .map((id) => {
      const item = getItemData(id);
      if (!item) return null;
      return { itemId: id, type: item.type === "folder" ? "folder" : "file" };
    })
    .filter(Boolean) as { itemId: string; type: "folder" | "file" }[];

  const deleteMutation = useMutation(orpc.browse.delete.mutationOptions());
  const isSingle = items.length === 1;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(items);
      setSelectedItems(new Set());
      await queryClient.invalidateQueries({ queryKey: orpc.browse.list.key() });
      await queryClient.invalidateQueries({ queryKey: orpc.folder.tree.key() });
      onClose();
    } catch (error) {
      const msg = getError(error, "Failed to delete items");
      toast.error(msg);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{isSingle ? "Delete item" : `Delete ${items.length} items`}</DialogTitle>
        <DialogDescription>
          {isSingle
            ? "Are you sure you want to delete this item? This action cannot be undone."
            : `Are you sure you want to delete ${items.length} items? This action cannot be undone.`}
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
