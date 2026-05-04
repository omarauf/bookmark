import type { DownloadMediaPayload, Job } from "@workspace/contracts/job";
import { formatDistanceToNow } from "date-fns";
import { fSize } from "@/utils/format-number";
import { DownloadStatusBadge } from "./status-badge";

type Props = {
  task: Job;
};

export function DownloadTaskItem({ task }: Props) {
  const payload = task.payload as DownloadMediaPayload | undefined;
  if (!payload) return null;

  const isVideo = payload.type === "video";
  const formattedSize = payload.size ? fSize(payload.size, 1) : "--";
  const formattedDuration = payload.duration ? `${Math.round(payload.duration)}s` : "--";

  return (
    <div className="group relative grid grid-cols-12 items-center gap-4 border border-transparent bg-background px-3 py-4 transition-all duration-300 hover:border-muted/30">
      <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-foreground/10 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="col-span-5 flex min-w-0 flex-col gap-1 md:col-span-6">
        <div className="flex items-center gap-2">
          <span className="rounded-sm bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            {payload.platform}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/60 uppercase">
            {payload.type}
          </span>
        </div>
        <a
          href={payload.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block w-full truncate font-medium text-foreground/80 text-sm transition-colors hover:text-foreground"
        >
          {payload.url}
        </a>
        <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground/50">
          <span>{task.id.slice(0, 8)}</span>
          <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      <div className="col-span-3 flex flex-col items-end gap-1.5 font-mono">
        {isVideo ? (
          <>
            <span className="text-foreground/70 text-xs">{formattedSize}</span>
            <span className="text-[10px] text-muted-foreground/60">
              {payload.width}×{payload.height} ({formattedDuration})
            </span>
          </>
        ) : (
          <>
            <span className="text-foreground/70 text-xs">{formattedSize}</span>
            {payload.width && payload.height && (
              <span className="text-[10px] text-muted-foreground/60">
                {payload.width}×{payload.height}
              </span>
            )}
          </>
        )}
      </div>

      <div className="col-span-4 flex flex-col items-end justify-center gap-1.5 md:col-span-3">
        <DownloadStatusBadge status={task.status} />
        {task.error && (
          <span
            className="max-w-full truncate text-right font-mono text-[10px] text-rose-500/70"
            title={task.error}
          >
            {task.error}
          </span>
        )}
      </div>
    </div>
  );
}
