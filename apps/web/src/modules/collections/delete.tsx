import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Collection } from "@workspace/contracts/collection";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { orpc } from "@/integrations/orpc";

type Props = {
  collection: Collection;
};

export function DeleteCollection({ collection }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    orpc.collection.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.collection.list.key() });
        toast.success("Collection deleted successfully");
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const openDeleteDialog = () => setOpen(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
          onClick={openDeleteDialog}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Collection</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the collection "{collection.name}"? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate({ id: collection.id })}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
