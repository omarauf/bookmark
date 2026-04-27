import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { orpc } from "@/integrations/orpc";

type Collection = {
  id: string;
  label: string;
};

type Props = {
  collection: Collection;
};

export function DeleteCollectionDialog({ collection }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(
    orpc.collection.delete.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: orpc.collection.all.key() });
        toast.success("Collection deleted successfully");
        setOpen(false);
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ id: collection.id });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <form onSubmit={onSubmitHandler}>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this collection? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="font-medium text-sm">{collection.label}</p>
            </div>
            <p className="mt-4 text-muted-foreground text-sm">
              Note: You cannot delete a collection that has child collections. Please delete or move
              the children first.
            </p>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
