import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ItemSchemas, type UpdateItem } from "@workspace/contracts/item";
import type { Youtube } from "@workspace/contracts/views/youtube";
import { toast } from "sonner";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";
import { getError } from "@/utils/error";

type Props = {
  youtube: Youtube;
  onClose: () => void;
};

export function YoutubeUpdateForm({ youtube, onClose }: Props) {
  const queryClient = useQueryClient();

  const tagsQuery = useQuery(orpc.tag.options.queryOptions());
  const collectionsQuery = useQuery(orpc.collection.options.queryOptions());
  const updateMutation = useMutation(orpc.item.update.mutationOptions());

  const defaultValues: UpdateItem = {
    id: youtube.id,
    note: youtube.note ?? "",
    rate: youtube.rate ?? 0,
    favorite: youtube.favorite ?? false,
    tagIds: youtube.tagIds ?? [],
    collectionIds: youtube.collectionIds ?? [],
  };

  const form = useAppForm({
    defaultValues,
    validators: { onSubmit: ItemSchemas.update.request },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync(value);
        queryClient.invalidateQueries({ queryKey: orpc.youtube.list.key() });
        toast.success("Item updated successfully");
        onClose();
      } catch (error) {
        const msg = getError(error, "Failed to update item");
        toast.error(msg);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
        <form.AppField name="note">
          {(field) => (
            <field.Textarea label="Notes" placeholder="Add notes..." className="text-xs" />
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

      <div className="flex shrink-0 justify-end gap-2 border-border/50 border-t p-5">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={onClose}
          disabled={updateMutation.isPending}
          type="button"
        >
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton className="text-xs">
            {updateMutation.isPending ? "Saving..." : "Save"}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
}
