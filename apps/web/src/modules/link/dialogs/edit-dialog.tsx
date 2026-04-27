import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ItemSchemas, type UpdateItem } from "@workspace/contracts/item";
import type { Link } from "@workspace/contracts/link";
import { Pencil } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppForm } from "@/components/form";
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
import { getError } from "@/utils/error";

type Props = {
  link: Link;
  showTrigger?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function EditLinkDialog({
  link,
  showTrigger = true,
  open: controlledOpen,
  onOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const queryClient = useQueryClient();

  const tagsQuery = useQuery(orpc.tag.options.queryOptions());
  const collectionsQuery = useQuery(orpc.collection.options.queryOptions());
  const updateMutation = useMutation(orpc.item.update.mutationOptions());

  const form = useAppForm({
    defaultValues: {
      id: link.id,
      note: link.note,
      rate: link.rate,
      favorite: link.favorite,
      tagIds: link.tagIds || [],
      collectionIds: link.collectionIds || [],
    } as UpdateItem,
    validators: { onSubmit: ItemSchemas.update.request },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync(value);
        queryClient.invalidateQueries({ queryKey: orpc.link.tree.key() });
        queryClient.invalidateQueries({ queryKey: orpc.link.list.key() });
        toast.success("Link updated successfully");
        setOpen(false);
      } catch (error) {
        const msg = getError(error, "Failed to update link");
        toast.error(msg);
      }
    },
    onSubmitInvalid: (errors) => {
      console.log("Validation errors:", errors);
    },
  });

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-4xl">
        <form onSubmit={onSubmitHandler}>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>Update link metadata and organization.</DialogDescription>
          </DialogHeader>

          <div className="flex gap-8 py-4">
            <div className="w-1/2 space-y-4">
              <form.AppField name="note">
                {(field) => <field.Textarea label="Notes" placeholder="Add notes..." />}
              </form.AppField>

              <form.AppField name="rate">
                {(field) => <field.Number label="Rate" placeholder="0-10" min={0} max={10} />}
              </form.AppField>

              <form.AppField name="favorite">
                {(field) => <field.Switch label="Favorite" />}
              </form.AppField>

              <form.AppField name="tagIds">
                {(field) => (
                  <field.ButtonGroup
                    label="Tags"
                    options={tagsQuery.data}
                    className="grid max-h-120 grid-cols-2 pr-3"
                  />
                )}
              </form.AppField>
            </div>

            <div className="max-h-fit w-1/2">
              <form.AppField name="collectionIds">
                {(field) => (
                  <field.TreeSelector
                    label="Collections"
                    options={collectionsQuery.data}
                    className="max-h-175"
                  />
                )}
              </form.AppField>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton>Save</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
