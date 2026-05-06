import { useQuery } from "@tanstack/react-query";
import type { Job } from "@workspace/contracts/job";
import { List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/integrations/orpc";
import { cn } from "@/lib/utils";
import { logLevelColors } from "../../badges/log-level";

type Props = {
  job: Job;
};

export function JobLogsCard({ job }: Props) {
  const { data, isLoading } = useQuery(
    orpc.job.logs.queryOptions({ input: { jobId: job.id, page: 1, perPage: 100 } }),
  );

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-normal text-[10px] text-muted-foreground uppercase tracking-widest">
            <List className="h-3.5 w-3.5" />
            Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-muted-foreground text-sm">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const logs = data || [];

  return (
    <Card className="border-border/50 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-normal text-[10px] text-muted-foreground uppercase tracking-widest">
          <List className="h-3.5 w-3.5" />
          Logs ({logs.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">[ NO_LOGS ]</div>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 border-border/30 border-b py-2 last:border-0"
              >
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    logLevelColors[log.level] || "bg-muted-foreground",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-xs">{log.message}</p>
                  {typeof log.metadata === "object" && !Array.isArray(log.metadata) && (
                    <div className="group relative mt-1">
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(JSON.stringify(log.metadata, null, 2))
                        }
                        className="absolute top-1 right-1 rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground opacity-0 transition-opacity hover:bg-muted/80 group-hover:opacity-100"
                      >
                        COPY
                      </button>

                      <pre className="overflow-auto text-wrap bg-muted/30 p-2 text-[10px] text-muted-foreground">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
