import { useNavigate, useSearch } from "@tanstack/react-router";
import { List, Network, SearchIcon } from "lucide-react";
import { useAppForm } from "@/components/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CreateCollectionDialog } from "../dialogs/create";

type Props = {
  className?: string;
};

export function CollectionFilter({ className }: Props) {
  const { search, view } = useSearch({ from: "/_authenticated/collections/" });
  const navigate = useNavigate({ from: "/collections/" });

  const form = useAppForm({
    defaultValues: { search: search ?? "", view: view ?? "tree" },
    listeners: {
      onChangeDebounceMs: 500,
      onChange({ formApi }) {
        navigate({ search: { search: formApi.state.values.search || undefined } });
      },
    },
  });

  return (
    <div className={cn("flex gap-4", className)}>
      <form.AppField name="search">
        {(field) => (
          <field.Input
            placeholder="Search tags..."
            icon={SearchIcon}
            classNames={{ wrapper: "w-96" }}
          />
        )}
      </form.AppField>

      <form.AppField name="view">
        {(field) => (
          <Tabs value={field.state.value} className="h-full" onValueChange={field.handleChange}>
            <TabsList>
              <TabsTrigger value="tree">
                <Network className="mr-2 h-4 w-4" />
                Tree View
              </TabsTrigger>
              <TabsTrigger value="table">
                <List className="mr-2 h-4 w-4" />
                Table View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </form.AppField>

      <div className="grow" />

      <CreateCollectionDialog />
    </div>
  );
}
