import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ImdbSchemas } from "@workspace/contracts/views/imdb";
import { Clapperboard, Eye, Film, MonitorPlay, Pen, Search, Star } from "lucide-react";
import { useEffect } from "react";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";
import { cn } from "@/lib/utils";
import { containsData } from "@/utils/object";
import { SyncButton } from "../components/sync";
import { ImdbTotalNumber } from "../components/total-number";

export function ImdbFilter() {
  const search = useSearch({ from: "/_authenticated/imdb/" });
  const navigate = useNavigate({ from: "/imdb/" });

  const genres = useQuery(orpc.imdb.genres.queryOptions());

  const filterData = ImdbSchemas.filter.safeParse(search);

  const form = useAppForm({
    defaultValues: search,
    listeners: {
      onChange({ formApi }) {
        const { ...rest } = formApi.state.values;
        navigate({ to: "/imdb", search: (prev) => ({ ...prev, ...rest, page: 1 }) });
      },
      onChangeDebounceMs: 500,
    },
  });

  const clearFilter = () => {
    navigate({ to: ".", search: undefined });
    form.reset(undefined);
  };

  useEffect(() => form.reset(search), [search, form.reset]);

  const hasData = containsData(filterData.data);

  return (
    <div className="flex flex-wrap items-center gap-3 border-border/50 border-b px-6 py-3">
      <form.AppField name="q">
        {(field) => (
          <field.Input
            placeholder="Search titles..."
            size="sm"
            classNames={{ wrapper: "w-64" }}
            icon={Search}
          />
        )}
      </form.AppField>

      <form.AppField name="kind">
        {(field) => (
          <field.ToggleGroup
            variant="outline"
            size="sm"
            options={[
              { label: "movie", value: "movie", icon: Film },
              { label: "tv", value: "tv", icon: MonitorPlay },
            ]}
          />
        )}
      </form.AppField>

      <form.AppField name="sortBy">
        {(field) => (
          <field.Select
            icon={Star}
            size="sm"
            placeholder="Sort By"
            classNames={{ wrapper: "w-36" }}
            options={[
              { label: "Added", value: "createdAt" },
              { label: "Rating", value: "rating" },
              { label: "Year", value: "year" },
            ]}
          />
        )}
      </form.AppField>

      <form.AppField name="genre">
        {(field) => (
          <field.Select
            icon={Clapperboard}
            placeholder="Genre"
            size="sm"
            classNames={{ wrapper: "w-36" }}
            options={genres.data?.map((genre) => ({ label: genre, value: genre }))}
          />
        )}
      </form.AppField>

      <form.AppField name="minRating">
        {(field) => (
          <field.Number placeholder="Min Rating" size="sm" classNames={{ wrapper: "w-36" }} />
        )}
      </form.AppField>

      <ImdbTotalNumber />

      <div className="grow" />

      <SyncButton />

      <form.AppField name="mode">
        {(field) => (
          <field.ToggleGroup
            variant="outline"
            size="sm"
            options={[
              { label: "View", value: "view", icon: Eye },
              { label: "Update", value: "update", icon: Pen },
            ]}
          />
        )}
      </form.AppField>

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
  );
}
