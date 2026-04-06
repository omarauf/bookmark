import { useQuery } from "@tanstack/react-query";
import { withForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";
import { formOpts } from "../utils/form-options";

export const CollectionsForm = withForm({
  ...formOpts,
  props: {},
  render: function Render({ form }) {
    const collectionsQuery = useQuery(orpc.collection.all.queryOptions());

    return (
      <form.AppField name="collectionIds">
        {(field) => (
          <div className="">
            <h3 className="mb-2 font-medium text-sm">Collections</h3>

            <div className="grid grid-cols-4 gap-4">
              {collectionsQuery.data?.map((collection) => {
                const isSelected = field.state.value?.includes(collection.id);
                return (
                  <Button
                    key={collection.id}
                    variant={isSelected ? "default" : "outline"}
                    className="flex items-center gap-2 leading-none"
                    onClick={() => {
                      if (isSelected) {
                        field.setValue(field.state.value?.filter((id) => id !== collection.id));
                      } else {
                        field.setValue([...(field.state.value || []), collection.id]);
                      }
                    }}
                  >
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: collection.color }}
                      aria-hidden="true"
                    />
                    {collection.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </form.AppField>
    );
  },
});
