import { Link } from "@tanstack/react-router";
import type { Job } from "@workspace/contracts/job";
import { Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobStatusBadge } from "../../job-status-badge";

type Props = {
  job: Job;
};

export function JobMetadataCard({ job }: Props) {
  return (
    <Card className="rounded-none border-border/50 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-mono font-normal text-[10px] text-muted-foreground uppercase tracking-widest">
          <Layers className="h-3.5 w-3.5" />
          Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Type
          </span>
          <Badge variant="outline" className="rounded-none font-mono text-[10px]">
            {job.type}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Status
          </span>
          <JobStatusBadge status={job.status} />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Attempts
          </span>
          <span className="font-mono text-xs">
            {job.attemptCount} / {job.maxAttempts}
          </span>
        </div>
        {job.groupId && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Group
            </span>
            <Link
              to="/job-groups/$id"
              params={{ id: job.groupId }}
              className="font-mono text-primary text-xs underline"
            >
              View Group
            </Link>
          </div>
        )}
        {job.resourceType && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Resource
            </span>
            <span className="font-mono text-muted-foreground text-xs">
              {job.resourceType} / {job.resourceId ?? "—"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
