import type { JobStatus } from "@workspace/contracts/job";
import { Activity, AlertTriangle, BarChart3, CheckCircle2, RotateCcw, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  statusCounts: Record<JobStatus, number>;
};

export function Overview({ statusCounts }: Props) {
  const {
    completed = 0,
    failed = 0,
    cancelled = 0,
    pending = 0,
    processing = 0,
    retrying = 0,
  } = statusCounts;
  const totalJobs = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  const activeJobs = processing + retrying;

  const totalFinished = completed + failed + cancelled;

  const completionRate = totalFinished > 0 ? Math.round((completed / totalFinished) * 100) : 0;

  const failureRate = totalJobs > 0 ? Math.round((failed / totalJobs) * 100) : 0;

  const cancellationRate = totalJobs > 0 ? Math.round((cancelled / totalJobs) * 100) : 0;

  const successVsFailure = failed > 0 ? (completed / failed).toFixed(1) : completed;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* Completion Rate */}
      <MetricCard
        label="Completion Rate"
        value={`${completionRate}%`}
        icon={<CheckCircle2 className="h-4 w-4" />}
        accent={
          completionRate >= 90
            ? "text-emerald-500"
            : completionRate >= 70
              ? "text-amber-500"
              : "text-rose-500"
        }
      />

      {/* Total Jobs */}
      <MetricCard
        label="Total Jobs"
        value={totalJobs}
        icon={<BarChart3 className="h-4 w-4" />}
        accent="text-slate-500"
      />

      {/* Active Jobs */}
      <MetricCard
        label="Active Jobs"
        value={activeJobs}
        icon={<Activity className="h-4 w-4" />}
        accent="text-blue-500"
      />

      {/* Pending Jobs */}
      <MetricCard
        label="Pending Jobs"
        value={pending}
        icon={<Timer className="h-4 w-4" />}
        accent={pending > activeJobs ? "text-amber-500" : "text-slate-500"}
      />

      {/* Failure Rate */}
      <MetricCard
        label="Failure Rate"
        value={`${failureRate}%`}
        icon={<AlertTriangle className="h-4 w-4" />}
        accent={
          failureRate < 5
            ? "text-emerald-500"
            : failureRate < 15
              ? "text-amber-500"
              : "text-rose-500"
        }
      />

      {/* Retrying Jobs */}
      <MetricCard
        label="Retrying"
        value={retrying}
        icon={<RotateCcw className="h-4 w-4" />}
        accent={retrying > 0 ? "text-amber-500" : "text-emerald-500"}
      />

      {/* Success vs Failure */}
      <MetricCard
        label="Success / Failure"
        value={successVsFailure}
        icon={<CheckCircle2 className="h-4 w-4" />}
        accent="text-indigo-500"
      />

      {/* Cancellation Rate */}
      <MetricCard
        label="Cancelled"
        value={`${cancellationRate}%`}
        icon={<Timer className="h-4 w-4" />}
        accent="text-gray-500"
      />
    </div>
  );
}
// ---------------------------------------------------------------------------

type MetricCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
};

export function MetricCard({ label, value, icon, accent }: MetricCardProps) {
  return (
    <Card className="flex flex-col gap-2 border border-border/50 bg-transparent p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <span className={`text-3xl tracking-tighter ${accent ?? "text-foreground"}`}>{value}</span>
    </Card>
  );
}
