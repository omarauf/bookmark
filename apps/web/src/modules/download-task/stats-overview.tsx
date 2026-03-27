type Props = {
  stats: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    exists: number;
  };
};

export function StatsOverview({ stats }: Props) {
  const successRate =
    stats.total > 0 ? Math.round((stats.completed / (stats.total || 1)) * 100) : 0;

  return (
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
  );
}
