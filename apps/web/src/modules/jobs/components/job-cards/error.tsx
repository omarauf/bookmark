import type { Job } from "@workspace/contracts/job";
import { XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Props = {
  job: Job;
};

export function JobErrorCard({ job }: Props) {
  if (!job.error && !job.errorDetail) return null;

  return (
    <Card className="rounded-none border-rose-500/30 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-mono font-normal text-[10px] text-rose-500 uppercase tracking-widest">
          <XCircle className="h-3.5 w-3.5" />
          Error Detail
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {job.error && (
          <div>
            <span className="font-mono text-[10px] text-rose-500/70 uppercase tracking-widest">
              Message
            </span>
            <p className="mt-1 font-mono text-rose-500 text-xs">{job.error}</p>
          </div>
        )}
        {job.errorDetail && (
          <>
            <Separator className="bg-rose-500/20" />
            <div>
              <span className="font-mono text-[10px] text-rose-500/70 uppercase tracking-widest">
                Stack Trace
              </span>
              <pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap rounded-none border border-rose-500/20 bg-rose-500/5 p-3 font-mono text-[10px] text-rose-500/80">
                {job.errorDetail}
              </pre>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
