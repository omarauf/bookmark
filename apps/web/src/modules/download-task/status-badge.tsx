import type { DownloadStatus } from "@workspace/contracts/download-task";
import { cn } from "@/lib/utils";

interface DownloadStatusBadgeProps {
  status: DownloadStatus;
  className?: string;
}

export function DownloadStatusBadge({ status, className }: DownloadStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase",
        status === "pending" && "text-muted-foreground",
        status === "processing" && "text-blue-400",
        status === "completed" && "text-emerald-500",
        status === "failed" && "text-rose-500",
        status === "exists" && "text-amber-500",
        className,
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "pending" && "bg-muted-foreground/40",
          status === "processing" && "bg-blue-400 animate-pulse",
          status === "completed" && "bg-emerald-500/80",
          status === "failed" && "bg-rose-500/80",
          status === "exists" && "bg-amber-500/80",
        )}
      />
      {status}
    </span>
  );
}
