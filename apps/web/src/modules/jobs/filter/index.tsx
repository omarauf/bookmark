import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { JobStatusValues, JobTypeValues } from "@workspace/contracts/job";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { orpc } from "@/integrations/orpc";

function formatLabel(value: string) {
  return value
    .split("_")
    .map((word, index) => {
      if (word === "imdb") return "IMDb";
      if (word === "youtube") return "YouTube";
      return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    })
    .join(" ");
}

type FilterRowProps<Value extends string> = {
  label: string;
  allLabel: string;
  values: readonly Value[];
  selected: readonly Value[];
  total: number | undefined;
  counts: Partial<Record<Value, number>> | undefined;
  onSelect: (value: Value | undefined) => void;
};

function FilterRow<Value extends string>({
  label,
  allLabel,
  values,
  selected,
  total,
  counts,
  onSelect,
}: FilterRowProps<Value>) {
  const itemClassName = "w-full justify-between gap-3";

  return (
    <div className="flex flex-col gap-2">
      <span className="px-1 font-medium text-xs">{label}</span>
      <ToggleGroup
        aria-label={`Filter jobs by ${label.toLowerCase()}`}
        orientation="vertical"
        className="grid w-full grid-cols-2 md:flex"
        value={selected.length ? selected : ["all"]}
        onValueChange={(selection) => onSelect(values.find((value) => value === selection[0]))}
      >
        <ToggleGroupItem value="all" className={itemClassName}>
          {allLabel} <span className="tabular-nums">{total?.toLocaleString() ?? "…"}</span>
        </ToggleGroupItem>
        {values.map((value) => (
          <ToggleGroupItem key={value} value={value} className={itemClassName}>
            {formatLabel(value)}{" "}
            <span className="tabular-nums">
              {counts ? (counts[value] ?? 0).toLocaleString() : "…"}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export function JobFilter() {
  const search = useSearch({ from: "/_authenticated/jobs/" });
  const navigate = useNavigate({ from: "/jobs/" });
  const statsQuery = useQuery(orpc.job.stats.queryOptions({ refetchInterval: 2000 }));
  const stats = statsQuery.data;

  return (
    <aside
      aria-label="Job filters"
      className="flex max-h-64 min-h-0 shrink-0 flex-col border-b md:max-h-none md:w-60 md:border-r md:border-b-0"
    >
      <header className="shrink-0 border-b px-4 py-3">
        <h2 className="font-medium text-sm">Filters</h2>
      </header>
      <div className="flex min-h-0 flex-col gap-6 overflow-y-auto px-2 py-4">
        <FilterRow
          label="Type"
          allLabel="All types"
          values={JobTypeValues}
          selected={search.type ? [search.type] : (search.types ?? [])}
          total={stats?.total}
          counts={stats?.byType}
          onSelect={(type) =>
            navigate({ search: (prev) => ({ ...prev, type, types: undefined, page: 1 }) })
          }
        />
        <FilterRow
          label="Status"
          allLabel="All statuses"
          values={JobStatusValues}
          selected={search.status ? [search.status] : []}
          total={stats?.total}
          counts={stats}
          onSelect={(status) => navigate({ search: (prev) => ({ ...prev, status, page: 1 }) })}
        />
        {statsQuery.isError && (
          <p role="alert" className="text-destructive text-xs">
            Job counts unavailable
          </p>
        )}
      </div>
    </aside>
  );
}
