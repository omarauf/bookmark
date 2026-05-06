import { ChartCard } from "./chart-card";

type Props = {
  data: {
    error: string;
    count: number;
  }[];
};

export function TopError({ data }: Props) {
  return (
    <ChartCard title="Top Errors">
      {data.length === 0 ? (
        <div className="flex h-60 items-center justify-center text-muted-foreground text-sm">
          [ NO_ERRORS_RECORDED ]
        </div>
      ) : (
        <div className="space-y-2 pt-2">
          {data.map((err, i: number) => (
            <div
              key={err.error}
              className="flex items-start gap-3 border-border/50 border-b pb-2 last:border-0"
            >
              <span className="mt-0.5 text-[10px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-foreground text-xs">{err.error}</p>
              </div>
              <span className="shrink-0 text-rose-500 text-xs">{err.count}</span>
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  );
}
