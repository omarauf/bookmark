import type { ReferenceType } from "@workspace/contracts/media";
import type { Platform } from "@workspace/contracts/platform";

type Props = {
  stats: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    exists: number;
    byPlatform: Record<Platform, number>;
    byReferenceType: Record<ReferenceType, number>;
  };
};

export function StatsOverview({ stats }: Props) {
  const successRate =
    stats.total > 0 ? Math.round((stats.completed / (stats.total || 1)) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="group grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
        {/* Total block */}
        <div className="relative flex flex-col gap-2 after:absolute after:top-2 after:-right-4 after:bottom-2 after:w-px after:bg-muted/30 md:after:-right-6">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Total Volumes
          </span>
          <span className="font-mono text-4xl text-foreground tracking-tighter md:text-5xl">
            {stats.total}
          </span>
        </div>

        {/* Success Block */}
        <div className="relative flex flex-col gap-2 after:top-2 after:-right-4 after:bottom-2 after:w-px after:bg-muted/30 md:after:absolute md:after:-right-6">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Success Rate
          </span>
          <span className="font-mono text-4xl text-foreground tracking-tighter md:text-5xl">
            {successRate}%
          </span>
          <span className="font-mono text-[10px] text-emerald-500 tracking-wider">
            {stats.completed} COMPLETED
          </span>
        </div>

        {/* In Flight Block */}
        <div className="relative flex flex-col gap-2 after:absolute after:top-2 after:-right-4 after:bottom-2 after:w-px after:bg-muted/30 md:after:-right-6">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            In Flight
          </span>
          <span className="font-mono text-4xl text-blue-400 tracking-tighter md:text-5xl">
            {stats.pending + stats.processing}
          </span>
          <span className="font-mono text-[10px] text-blue-400/70 tracking-wider">
            {stats.processing} ACTIVE / {stats.pending} WAIT
          </span>
        </div>

        {/* Failed Block */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Anomalies
          </span>
          <span className="font-mono text-4xl text-rose-500 tracking-tighter md:text-5xl">
            {stats.failed}
          </span>
          <span className="font-mono text-[10px] text-rose-500/70 tracking-wider">FAILED JOBS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 border-muted/30 border-t pt-6 md:grid-cols-2 md:gap-12">
        <div>
          <span className="mb-4 block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            By Platform
          </span>
          <div className="flex flex-wrap gap-6">
            {Object.entries(stats.byPlatform || {}).map(([platform, count]) => (
              <div key={platform} className="flex flex-col gap-1">
                <span className="font-mono text-2xl text-foreground tracking-tighter">{count}</span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">
                  {platform}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-4 block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            By Reference Type
          </span>
          <div className="flex flex-wrap gap-6">
            {Object.entries(stats.byReferenceType || {}).map(([refType, count]) => (
              <div key={refType} className="flex flex-col gap-1">
                <span className="font-mono text-2xl text-foreground tracking-tighter">{count}</span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">
                  {refType}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
