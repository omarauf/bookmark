import type { DownloadTask } from "@workspace/contracts/download-task";
import { formatDistanceToNow } from "date-fns";
import { fSize } from "@/utils/format-number";
import { DownloadStatusBadge } from "./status-badge";

type Props = {
  task: DownloadTask;
};

export function DownloadTaskItem({ task }: Props) {
  const isVideo = task.type === "video";
  const formattedSize = task.size ? fSize(task.size, 1) : "--";
  const formattedDuration = task.duration ? `${Math.round(task.duration)}s` : "--";

  return (
    <div className="group relative grid grid-cols-12 gap-4 px-3 py-4 items-center bg-background border border-transparent hover:border-muted/30 transition-all duration-300">
      {/* Decorative left line on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Primary Info (URL/Platform) - Col 1 to 6 */}
      <div className="col-span-5 md:col-span-6 flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-muted/40 text-muted-foreground uppercase tracking-widest">
            {task.platform}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">
            {task.type}
          </span>
        </div>
        <a
          href={task.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-foreground/80 hover:text-foreground truncate transition-colors inline-block w-full"
        >
          {task.url}
        </a>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50 font-mono">
          <span>{task.id.slice(0, 8)}</span>
          <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      {/* Metrics - Col 6 to 9 */}
      <div className="col-span-3 flex flex-col items-end gap-1.5 font-mono">
        {isVideo ? (
          <>
            <span className="text-xs text-foreground/70">{formattedSize}</span>
            <span className="text-[10px] text-muted-foreground/60">
              {task.width}×{task.height} ({formattedDuration})
            </span>
          </>
        ) : (
          <>
            <span className="text-xs text-foreground/70">{formattedSize}</span>
            {task.width && task.height && (
              <span className="text-[10px] text-muted-foreground/60">
                {task.width}×{task.height}
              </span>
            )}
          </>
        )}
      </div>

      {/* Status - Col 9 to 12 */}
      <div className="col-span-4 md:col-span-3 flex flex-col items-end justify-center gap-1.5">
        <DownloadStatusBadge status={task.status} />
        {task.error && (
          <span
            className="text-[10px] text-rose-500/70 font-mono truncate max-w-full text-right"
            title={task.error}
          >
            {task.error}
          </span>
        )}
      </div>
    </div>
  );
}
