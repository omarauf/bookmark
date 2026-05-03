import { useQuery } from "@tanstack/react-query";
import type { Job } from "@workspace/contracts/job";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orpc } from "@/integrations/orpc";
import { levelIcons } from "./badges/log-level";

type Props = {
  job?: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function JobLogsDialog({ job, open, onOpenChange }: Props) {
  const logsQuery = useQuery(
    orpc.job.logs.queryOptions({
      input: { jobId: job?.id || "", page: 1, perPage: 100 },
      enabled: !!job,
    }),
  );

  const logs = logsQuery.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-sm">Job Logs — {job?.type}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-100 rounded-md border">
          <div className="flex flex-col gap-1 p-2">
            {logs.length === 0 && (
              <p className="py-8 text-center text-muted-foreground text-sm">No logs yet.</p>
            )}
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2 rounded px-2 py-1.5 text-xs hover:bg-muted/50"
              >
                <span className="mt-0.5 shrink-0">{levelIcons[log.level]}</span>
                <span className="shrink-0 whitespace-nowrap text-muted-foreground">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
                <span className="break-all">{log.message}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
