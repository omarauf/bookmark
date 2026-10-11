import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ItemSchemas, type UpdateItem } from "@workspace/contracts/item";
import type { Youtube } from "@workspace/contracts/views/youtube";
import { Heart } from "lucide-react";
import { useId } from "react";
import { toast } from "sonner";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { orpc } from "@/integrations/orpc";
import { getError } from "@/utils/error";

type Props = {
  youtube: Youtube;
  onClose: () => void;
};

export function YoutubeUpdateForm({ youtube, onClose }: Props) {
  const formId = useId();
  const favoriteId = useId();
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
    formId,
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <form id={formId} onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <form.AppField name="rate">
          {(field) => (
            <field.StarRating
              classNames={{ wrapper: "w-fit" }}
              disabled={updateMutation.isPending}
              label="Rating"
            />
          )}
        </form.AppField>

        <form.AppField name="favorite">
          {(field) => (
            <Field className="w-fit">
              <FieldLabel htmlFor={favoriteId}>Favorite</FieldLabel>
              <Toggle
                id={favoriteId}
                type="button"
                variant="outline"
                pressed={field.state.value ?? false}
                onPressedChange={field.handleChange}
                onBlur={field.handleBlur}
                disabled={updateMutation.isPending}
                className="aspect-square h-8 w-8 motion-safe:active:scale-95"
              >
                <Heart className={field.state.value ? "fill-current" : undefined} />
              </Toggle>
            </Field>
          )}
        </form.AppField>
      </div>

      <form.AppField name="note">
        {(field) => <field.Textarea label="Notes" placeholder="Add notes..." className="text-xs" />}
      </form.AppField>

      <form.AppField name="tagIds">
        {(field) => <field.ButtonGroup label="Tags" options={tagsQuery.data} className="h-40" />}
      </form.AppField>

      <form.AppField name="collectionIds">
        {(field) => (
          <field.TreeSelector
            label="Collections"
            options={collectionsQuery.data}
            className="min-h-0 flex-1"
            classNames={{
              wrapper:
                "h-auto min-h-0 flex-1 overflow-hidden [&>[data-slot=field-content]]:flex-none",
            }}
          />
        )}
      </form.AppField>

      <div className="flex shrink-0 justify-end gap-2 border-border/50 border-t pt-3">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={updateMutation.isPending}
          type="button"
        >
          Cancel
        </Button>

        <form.AppForm>
          <form.SubmitButton>{updateMutation.isPending ? "Saving..." : "Save"}</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
}
