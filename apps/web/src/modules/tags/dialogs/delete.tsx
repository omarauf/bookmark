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

type Tag = {
  id: string;
  name: string;
};

type Props = {
  tag: Tag;
};

export function DeleteTagDialog({ tag }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(
    orpc.tag.delete.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: orpc.tag.list.key() });
        toast.success("Tag deleted successfully");
        setOpen(false);
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ id: tag.id });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-sm p-1 text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <form onSubmit={onSubmitHandler}>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tag? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="font-medium text-sm">#{tag.name}</p>
            </div>
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
