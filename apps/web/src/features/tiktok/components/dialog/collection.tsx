import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { orpc } from "@/api/rpc";
import { withForm } from "@/components/tanstack-form";
import { DEFAULT_POST } from "../../constants";

export const CollectionsForm = withForm({
  defaultValues: DEFAULT_POST,
  props: {},
  render: function Render({ form }) {
    const collectionsQuery = useQuery(orpc.collections.list.queryOptions({ input: {} }));

    return (
      <form.AppField name="collections">
        {(field) => (
          <div className="">
            <h3 className="mb-2 font-medium text-sm">Collections</h3>

            <div className="grid grid-cols-4 gap-4">
              {collectionsQuery.data?.map((collection) => {
                const isSelected = field.state.value.includes(collection.id);
                return (
                  <Button
                    key={collection.id}
                    variant={isSelected ? "default" : "outline"}
                    // className="w-fit border"
                    onClick={() => {
                      if (isSelected)
                        field.setValue((prev) => prev.filter((c) => c !== collection.id));
                      else field.setValue((prev) => [...prev, collection.id]);
                    }}
                  >
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: collection.color }}
                      aria-hidden="true"
                    />
                    {collection.name}
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
