import { useQuery } from "@tanstack/react-query";
import type { JobType } from "@workspace/contracts/job";
import { Activity } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { orpc } from "@/integrations/orpc";
import { cn } from "@/lib/utils";
import { AnalyticsCard } from "../components/analytics-card";

type Props = {
  className?: string;
};

export function JobAnalytics({ className }: Props) {
  const [types] = useLocalStorage<JobType[] | undefined>("analytics_types", undefined);

  const { data } = useQuery(orpc.job.analytics.queryOptions({ input: { types } }));

  if (data === undefined) {
    return (
      <div className="flex h-75 items-center justify-center">
        <Activity className="mr-2 h-4 w-4 animate-spin" />
        Loading analytics...
      </div>
    );
  }

  return (
    <div className={cn("space-y-8 p-6", className)}>
      <AnalyticsCard.Overview statusCounts={data.statusCounts} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnalyticsCard.StatusDistributionCard data={data.statusCounts} />

        <AnalyticsCard.JobByType data={data.typeCounts} />
      </div>

      <AnalyticsCard.JobOverTime data={data.jobsByDay} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnalyticsCard.AverageDuration data={data.durationByType} />

        <AnalyticsCard.AttemptDistribution data={data.attemptDistribution} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnalyticsCard.GroupSize data={data.groupSizes} />

        <AnalyticsCard.TopError data={data.topErrors} />
      </div>
    </div>
  );
}
