import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/integrations/orpc";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function JobMetrics({ className }: Props) {
  const { data: stats, isError } = useQuery(orpc.job.stats.queryOptions({ refetchInterval: 2000 }));

  const finished = stats ? stats.completed + stats.failed + stats.cancelled : 0;
  const metrics = [
    {
      label: "Completion rate",
      value: stats ? `${finished > 0 ? Math.round((stats.completed / finished) * 100) : 0}%` : "…",
    },
    { label: "Total jobs", value: stats?.total.toLocaleString() ?? "…" },
    {
      label: "Active jobs",
      value: stats ? (stats.processing + stats.retrying).toLocaleString() : "…",
    },
    { label: "Pending jobs", value: stats?.pending.toLocaleString() ?? "…" },
    {
      label: "Failure rate",
      value: stats
        ? `${stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0}%`
        : "…",
    },
    { label: "Retrying", value: stats?.retrying.toLocaleString() ?? "…" },
    {
      label: "Success / failure",
      value: stats
        ? stats.failed > 0
          ? (stats.completed / stats.failed).toFixed(1)
          : stats.completed.toLocaleString()
        : "…",
    },
    {
      label: "Cancelled",
      value: stats
        ? `${stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0}%`
        : "…",
    },
  ];

  return (
    <section aria-label="Job metrics" className={cn("p-4 text-foreground", className)}>
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
        {metrics.map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <dt className="mb-1.5 text-xs">{label}</dt>
            <dd className="font-medium text-lg tabular-nums">
              {isError && !stats ? "Unavailable" : value}
            </dd>
          </div>
        ))}
      </dl>
      {isError && !stats && (
        <p role="alert" className="pt-2 text-sm">
          Job metrics unavailable
        </p>
      )}
    </section>
  );
}
