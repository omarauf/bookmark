import { useQuery } from "@tanstack/react-query";
import { withForm } from "@/components/form";
import { orpc } from "@/integrations/orpc";
import { formOpts } from "../utils/form-options";

export const TagForm = withForm({
  ...formOpts,
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
          <field.Autocomplete
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
