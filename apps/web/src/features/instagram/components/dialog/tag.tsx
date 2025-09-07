import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orpc } from "@/api/rpc";
import { withForm } from "@/components/tanstack-form";
import { DEFAULT_POST } from "../../constants";

export const TagForm = withForm({
  defaultValues: DEFAULT_POST,
  props: {},
  render: function Render({ form }) {
    const tagsQuery = useQuery(orpc.tags.list.queryOptions({ input: {} }));
    const queryClient = useQueryClient();
    const createMutation = useMutation(
      orpc.tags.create.mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: orpc.tags.list.key() });
          toast.success("Tag created successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }),
    );

    return (
      <form.AppField name="tags">
        {(field) => (
          <field.AutocompleteField
            label="Tags"
            options={tagsQuery.data?.map((tag) => ({ label: tag.name, value: tag.id })) || []}
            onAdd={async (v) => {
              const createdTag = await createMutation.mutateAsync({ name: v });
              field.setValue([...field.state.value, createdTag.id]);
            }}
          />
        )}
      </form.AppField>
    );
  },
});
