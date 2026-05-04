import type { JobStatus } from "@workspace/contracts/job";
import { cn } from "@/lib/utils";

interface DownloadStatusBadgeProps {
  status: JobStatus;
  className?: string;
}

export function DownloadStatusBadge({ status, className }: DownloadStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest",
        status === "pending" && "text-muted-foreground",
        status === "processing" && "text-blue-400",
        status === "completed" && "text-emerald-500",
        status === "failed" && "text-rose-500",
        status === "cancelled" && "text-amber-500",
        status === "retrying" && "text-blue-400",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "pending" && "bg-muted-foreground/40",
          status === "processing" && "animate-pulse bg-blue-400",
          status === "completed" && "bg-emerald-500/80",
          status === "failed" && "bg-rose-500/80",
          status === "cancelled" && "bg-amber-500/80",
          status === "retrying" && "animate-pulse bg-blue-400",
        )}
      />
      {status}
    </span>
  );
}
