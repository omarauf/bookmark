import type { Job } from "@workspace/contracts/job";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  job: Job;
};

export function JobProgressCard({ job }: Props) {
  if (job.progress === undefined) return null;

  return (
    <Card className="border-border/50 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-normal text-[10px] text-muted-foreground uppercase tracking-widest">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-full text-end font-medium text-xs">{job.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden border border-border/50">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
