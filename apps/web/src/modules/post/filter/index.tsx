import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { PostSchemas } from "@workspace/contracts/post";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";
import { cn } from "@/lib/utils";
import { containsData } from "@/utils/object";
import { DisplaySettingsMenu } from "./display-settings";

export function Filter({ className }: { className?: string }) {
  const collectionsQuery = useQuery(orpc.collection.all.queryOptions());

  const search = useSearch({ strict: false });

  const navigate = useNavigate();

  const searchData = PostSchemas.list.request.safeParse(search);
  const filterData = PostSchemas.filter.safeParse(search);

  if (!searchData.success) {
    throw new Error("Invalid search data");
  }

  const hasData = containsData(filterData.data);

  const form = useAppForm({
    defaultValues: {
      ...searchData.data,
      rangeData: {
        from: searchData.data.from,
        to: searchData.data.to,
      },
    },
    listeners: {
      onChange({ formApi }) {
        const { rangeData, ...rest } = formApi.state.values;
        navigate({ to: ".", search: (prev) => ({ ...prev, ...rest, ...rangeData }) });
      },
      onChangeDebounceMs: 500,
    },
  });

  const clearFilter = () => {
    navigate({ to: ".", search: undefined });
    form.reset(undefined);
  };

  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 px-3 py-4 transition-all duration-300",
        className,
      )}
    >
      <div className="no-scrollbar -mb-1 flex flex-1 items-center gap-3 overflow-x-auto pb-1">
        <DisplaySettingsMenu />

        <form.AppField name="username">
          {(field) => (
            <field.Input
              placeholder="Search username..."
              className="bg-background/50 transition-colors focus:bg-background"
              classNames={{ wrapper: "w-64 shrink-0" }}
            />
          )}
        </form.AppField>

        <form.AppField name="type">
          {(field) => (
            <field.Select
              placeholder="All Types"
              className="bg-background/50"
              classNames={{ wrapper: "w-36 shrink-0" }}
              options={[
                { label: "Photo", value: "Photo" },
                { label: "Video", value: "Video" },
                { label: "IGTV", value: "IGTV" },
                { label: "Reel", value: "Reel" },
                { label: "Carousel", value: "Carousel" },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="collectionPaths">
          {(field) => (
            <field.MultiSelect
              placeholder="Collections"
              className="w-64 bg-background/50"
              options={collectionsQuery.data?.map((t) => ({ label: t.label, value: t.path }))}
            />
          )}
        </form.AppField>

        <form.AppField name="rangeData">
          {(field) => (
            <field.DateRange placeholder="Date Range" classNames={{ wrapper: "w-60 shrink-0" }} />
          )}
        </form.AppField>

        <form.AppField name="sortOrder">
          {(field) => (
            <field.Tabs
              defaultValue="desc"
              options={[
                { label: "Latest", value: "desc" },
                { label: "Oldest", value: "asc" },
              ]}
            />
          )}
        </form.AppField>
      </div>

      <div className="flex items-center gap-2 border-border/40 border-l pl-2">
        <Button
          variant={hasData ? "secondary" : "ghost"}
          size="sm"
          disabled={!hasData}
          onClick={clearFilter}
          className={cn(
            "transition-all",
            hasData ? "text-foreground" : "text-muted-foreground opacity-50",
          )}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
