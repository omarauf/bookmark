import { useQuery } from "@tanstack/react-query";
import { withForm } from "@/components/tanstack-form";
import { orpc } from "@/integrations/orpc";
import { DEFAULT_POST } from "../../constants";

export const TagForm = withForm({
  defaultValues: DEFAULT_POST,
  props: {},
  render: function Render({ form }) {
    const tagsQuery = useQuery(orpc.tag.options.queryOptions());
    // const queryClient = useQueryClient();
    // const createMutation = useMutation(
    //   orpc.tag.create.mutationOptions({
    //     onSuccess: () => {
    //       queryClient.invalidateQueries({ queryKey: orpc.tag.options.key() });
    //       toast.success("Tag created successfully");
    //     },
    //     onError: (error) => {
    //       toast.error(error.message);
    //     },
    //   }),
    // );

    return (
      <form.AppField name="tagIds">
        {(field) => (
          <field.AutocompleteField
            label="Tags"
            options={tagsQuery.data?.map((tag) => ({ label: tag.name, value: tag.id })) || []}
            onAdd={async (v) => {
              console.log("Adding tag:", v);
              // const createdTag = await createMutation.mutateAsync({ name: v });
              // field.setValue([...field.state.value, createdTag.id]);
            }}
          />
        )}
      </form.AppField>
    );
  },
});
