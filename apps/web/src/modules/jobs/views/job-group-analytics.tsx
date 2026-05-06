import { useQuery } from "@tanstack/react-query";
import { BarChart3, Layers, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/integrations/orpc";
import { MetricCard } from "../components/analytics-card/overview";

type Props = {
  groupId: string;
};

export function JobGroupAnalytics({ groupId }: Props) {
  const { data: stats } = useQuery(
    orpc.job.group.stats.queryOptions({
      input: { groupId },
      refetchInterval: 2000,
      staleTime: 0,
    }),
  );

  if (!stats) return null;

  const totalProgress =
    stats.total > 0
      ? Math.round(((stats.completed + stats.failed + stats.cancelled) / stats.total) * 100)
      : 0;

  return (
    <>
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Total" value={String(stats.total)} icon={<List className="h-4 w-4" />} />
        <MetricCard
          label="Completed"
          value={String(stats.completed)}
          icon={<BarChart3 className="h-4 w-4" />}
          accent="text-emerald-500"
        />
        <MetricCard
          label="Failed"
          value={String(stats.failed)}
          icon={<Layers className="h-4 w-4" />}
          accent="text-rose-500"
        />
        <MetricCard
          label="Active"
          value={String(stats.processing + stats.pending + stats.retrying)}
          icon={<List className="h-4 w-4" />}
          accent="text-blue-400"
        />
      </div>

      {/* Overall Progress */}
      <Card className="border-border/50 bg-transparent shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-normal text-[10px] text-muted-foreground uppercase tracking-widest">
            <BarChart3 className="h-3.5 w-3.5" />
            Group Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                {stats.completed + stats.failed + stats.cancelled} / {stats.total} resolved
              </span>
              <span className="font-medium text-xs">{totalProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden border border-border/50">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
