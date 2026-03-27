import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export function Delete() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hard, setHard] = useState(false);

  const deletePostMutation = useMutation(
    orpc.post.deleteAll.mutationOptions({
      onSuccess: () => {
        toast.success("Instagram deleted successfully");
      },
    }),
  );

  const deleteUserMutation = useMutation(
    orpc.creator.deleteAll.mutationOptions({
      onSuccess: () => {
        toast.success("Instagram deleted successfully");
      },
    }),
  );

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" onClick={openDeleteDialog}>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Instagram</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete all data about instagram? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <Checkbox checked={hard} onCheckedChange={(v) => setHard(v as boolean)} />
          <label
            aria-hidden="true"
            htmlFor="terms"
            className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            onClick={() => setHard((prev) => !prev)}
          >
            Hard delete all data
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deletePostMutation.mutate({ hard });
              deleteUserMutation.mutate({ hard });
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
