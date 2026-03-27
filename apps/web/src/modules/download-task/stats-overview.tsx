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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 group">
      {/* Total block */}
      <div className="flex flex-col gap-2 relative after:absolute after:-right-4 md:after:-right-6 after:top-2 after:bottom-2 after:w-px after:bg-muted/30">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Total Volumes
        </span>
        <span className="text-4xl md:text-5xl font-mono text-foreground tracking-tighter">
          {stats.total}
        </span>
      </div>

      {/* Success Block */}
      <div className="flex flex-col gap-2 relative md:after:absolute after:-right-4 md:after:-right-6 after:top-2 after:bottom-2 after:w-px after:bg-muted/30">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Success Rate
        </span>
        <span className="text-4xl md:text-5xl font-mono text-foreground tracking-tighter">
          {successRate}%
        </span>
        <span className="text-[10px] text-emerald-500 font-mono tracking-wider">
          {stats.completed} COMPLETED
        </span>
      </div>

      {/* In Flight Block */}
      <div className="flex flex-col gap-2 relative after:absolute after:-right-4 md:after:-right-6 after:top-2 after:bottom-2 after:w-px after:bg-muted/30">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          In Flight
        </span>
        <span className="text-4xl md:text-5xl font-mono text-blue-400 tracking-tighter">
          {stats.pending + stats.processing}
        </span>
        <span className="text-[10px] text-blue-400/70 font-mono tracking-wider">
          {stats.processing} ACTIVE / {stats.pending} WAIT
        </span>
      </div>

      {/* Failed Block */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Anomalies
        </span>
        <span className="text-4xl md:text-5xl font-mono text-rose-500 tracking-tighter">
          {stats.failed}
        </span>
        <span className="text-[10px] text-rose-500/70 font-mono tracking-wider">FAILED JOBS</span>
      </div>
    </div>
  );
}
