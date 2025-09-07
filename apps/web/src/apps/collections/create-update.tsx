import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Collection,
  CreateCollection,
  UpdateCollection,
} from "@workspace/contracts/collection";
import { CreateCollectionSchema, UpdateCollectionSchema } from "@workspace/contracts/collection";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Pencil, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { orpc } from "@/api/rpc";
import { useAppForm } from "@/components/tanstack-form";

type Props = {
  collection?: Collection;
};

export function CreateUpdateCollection({ collection }: Props) {
  const [open, setOpen] = useState(false);
  const isUpdate = collection !== undefined;
  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    orpc.collections.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.collections.list.key() });
        toast.success("Collection updated successfully");
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const createMutation = useMutation(
    orpc.collections.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.collections.list.key() });
        toast.success("Collection created successfully");
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const defaultValues = useMemo<CreateCollection | UpdateCollection>(
    () => ({
      id: collection ? collection.id : undefined,
      name: collection ? collection.name : "",
      color: collection ? collection.color : "",
    }),
    [collection],
  );

  const form = useAppForm({
    defaultValues,
    validators: { onChange: isUpdate ? UpdateCollectionSchema : CreateCollectionSchema },
    onSubmit: ({ value }) =>
      isUpdate
        ? updateMutation.mutate({ ...value, id: collection.id })
        : createMutation.mutate(value),
  });

  const openHandler = () => {
    form.reset(defaultValues);
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isUpdate ? (
          <Button
            onClick={openHandler}
            className="rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Pencil size={16} />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Crate New Collection
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>{isUpdate ? "Update Collection" : "Create New Collection"}</DialogTitle>
            <DialogDescription>
              {isUpdate ? "Update" : "Add a new"} collection with a name, color, and type.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.AppField name="name">{(field) => <field.TextField label="Name" />}</form.AppField>
            <form.AppField name="color">
              {(field) => <field.TextField label="Color" />}
            </form.AppField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <form.AppForm>
              <form.SubmitButton>{isUpdate ? "Update" : "Create"}</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
