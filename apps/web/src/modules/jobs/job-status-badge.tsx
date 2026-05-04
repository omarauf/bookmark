import type { JobStatus } from "@workspace/contracts/job";
import { Badge } from "@/components/ui/badge";

const statusMap: Record<
  JobStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending", variant: "outline" },
  processing: { label: "Processing", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "outline" },
  retrying: { label: "Retrying", variant: "default" },
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const config = statusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
