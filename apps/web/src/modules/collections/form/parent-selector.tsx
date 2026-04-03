import { useQuery } from "@tanstack/react-query";
import { withFieldGroup } from "@/components/form";
import { orpc } from "@/integrations/orpc";

export const ParentSelector = withFieldGroup({
  defaultValues: {
    parentId: "parentId" as string | null,
  },
  render: function Render({ group }) {
    const { data } = useQuery(orpc.collection.all.queryOptions());

    const filteredParents = data || [];

    return (
      <group.AppField name="parentId">
        {(field) => (
          <field.Select
            label="Parent Collection (Optional)"
            placeholder="Select a parent collection"
            options={[
              ...filteredParents.map((cat) => ({
                label: `${" ".repeat((cat.level - 1) * 2)} (${cat.level}) ${cat.slug}`,
                value: cat.id,
              })),
            ]}
          />
        )}
      </group.AppField>
    );
  },
});
