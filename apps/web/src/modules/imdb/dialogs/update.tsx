import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ImdbItem } from "@workspace/contracts/imdb-view";
import { ItemSchemas, type UpdateItem } from "@workspace/contracts/item";
import { toast } from "sonner";
import { useAppForm } from "@/components/form";
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
import { getError } from "@/utils/error";

type Props = {
  item: ImdbItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ImdbUpdateDialog({ item, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();

  const tagsQuery = useQuery(orpc.tag.options.queryOptions());
  const collectionsQuery = useQuery(orpc.collection.options.queryOptions());
  const updateMutation = useMutation(orpc.item.update.mutationOptions());

  const form = useAppForm({
    defaultValues: {
      id: item.id,
      note: item.note ?? "",
      rate: item.rate ?? 0,
      favorite: item.favorite ?? false,
      tagIds: item.tagIds ?? [],
      collectionIds: item.collectionIds ?? [],
    } as UpdateItem,
    validators: { onSubmit: ItemSchemas.update.request },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync(value);
        queryClient.invalidateQueries({ queryKey: orpc.imdb.list.key() });
        toast.success("Item updated successfully");
        onOpenChange(false);
      } catch (error) {
        const msg = getError(error, "Failed to update item");
        toast.error(msg);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-auto max-h-[90vh] w-full flex-col gap-0 overflow-hidden rounded-none border border-border/50 bg-background p-0 shadow-2xl sm:h-130 sm:w-120"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-border/50 border-b p-5 text-left">
          <DialogTitle className="font-mono font-semibold text-foreground text-sm">
            Update
          </DialogTitle>
          <DialogDescription className="font-mono text-[10px] text-muted-foreground">
            {item.caption ?? item.externalId}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="space-y-4 p-5">
            <form.AppField name="note">
              {(field) => (
                <field.Textarea
                  label="Notes"
                  placeholder="Add notes..."
                  className="font-mono text-xs"
                />
              )}
            </form.AppField>

            <div className="grid grid-cols-2 gap-4">
              <form.AppField name="rate">
                {(field) => <field.Number label="Rate" placeholder="0-10" min={0} max={10} />}
              </form.AppField>

              <form.AppField name="favorite">
                {(field) => <field.Switch label="Favorite" />}
              </form.AppField>
            </div>

            <form.AppField name="tagIds">
              {(field) => (
                <field.ButtonGroup
                  label="Tags"
                  options={tagsQuery.data}
                  className="grid max-h-40 grid-cols-2 gap-1 overflow-y-auto pr-1"
                />
              )}
            </form.AppField>

            <form.AppField name="collectionIds">
              {(field) => (
                <field.TreeSelector
                  label="Collections"
                  options={collectionsQuery.data}
                  className="max-h-48"
                />
              )}
            </form.AppField>
          </div>

          <DialogFooter className="border-border/50 border-t p-5">
            <Button
              variant="outline"
              size="sm"
              className="rounded-none font-mono text-xs"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </Button>
            <form.AppForm>
              <form.SubmitButton className="rounded-none font-mono text-xs">
                {updateMutation.isPending ? "Saving..." : "Save"}
              </form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
