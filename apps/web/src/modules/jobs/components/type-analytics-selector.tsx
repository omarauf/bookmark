import { JobTypeValues } from "@workspace/contracts/job";
import { useAppForm } from "@/components/form";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function TypeAnalyticsSelector() {
  const [types, setTypes] = useLocalStorage<string[] | undefined>("analytics_types", undefined);

  const form = useAppForm({
    defaultValues: {
      types: types ?? [],
    },

    listeners: {
      onChange: ({ formApi }) => {
        const { types } = formApi.state.values;
        if (types.length === 0) {
          setTypes(undefined);
        } else {
          setTypes(types);
        }
      },
    },
  });

  return (
    <form.AppField name="types">
      {(field) => (
        <field.MultiSelect
          options={JobTypeValues.map((type) => ({ label: type, value: type }))}
          placeholder="Filter by type"
          classNames={{ wrapper: "w-48" }}
        />
      )}
    </form.AppField>
  );
}
