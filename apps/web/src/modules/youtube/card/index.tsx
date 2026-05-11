import { useSearch } from "@tanstack/react-router";
import type { Youtube } from "@workspace/contracts/views/youtube";
import { Eye, HardDrive, Play, Tv } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { YoutubeDetailsDialog } from "../dialogs/details";
import { YoutubeUpdateDialog } from "../dialogs/update";

type Props = {
  youtube: Youtube;
};

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function YoutubeCard({ youtube }: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const updateMode = useSearch({
    from: "/_authenticated/youtube/",
    select: (s) => s.update === true,
  });

  const handleClick = () => {
    if (updateMode) {
      setUpdateOpen(true);
    } else {
      setDetailsOpen(true);
    }
  };

  const downloadedVideos = youtube.media.filter((m) => m.type === "video").length;

  return (
    <>
      <Card
        className="group cursor-pointer gap-0 overflow-hidden border-border/50 bg-transparent p-0 shadow-none transition-colors hover:border-foreground/30"
        onClick={handleClick}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {youtube.thumbnail ? (
            <img
              src={youtube.thumbnail}
              alt={youtube.caption ?? youtube.externalId}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Tv className="h-8 w-8 text-muted-foreground/30" />
            </div>
          )}

          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
              <Play className="h-4 w-4 fill-foreground text-foreground" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute right-2 bottom-2 bg-black/80 px-1.5 py-0.5 font-medium text-[10px] text-white">
            {formatDuration(youtube.duration)}
          </div>

          {/* Downloaded Indicator */}
          {downloadedVideos > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 px-1.5 py-0.5 text-[10px] text-white">
              <HardDrive className="h-3 w-3" />
              <span>{downloadedVideos}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1 p-2">
          <h3 className="line-clamp-2 min-h-[2.5em] font-medium text-foreground text-xs leading-tight">
            {youtube.caption ?? youtube.externalId}
          </h3>

          <div className="mt-auto flex items-center justify-between">
            <span className="truncate text-[10px] text-muted-foreground">
              {youtube.channelTitle}
            </span>
            <span className="flex shrink-0 items-center gap-0.5 text-[10px] text-muted-foreground/60">
              <Eye className="h-2.5 w-2.5" />
              {formatCount(youtube.views)}
            </span>
          </div>
        </div>
      </Card>

      <YoutubeDetailsDialog youtube={youtube} open={detailsOpen} onOpenChange={setDetailsOpen} />
      <YoutubeUpdateDialog youtube={youtube} open={updateOpen} onOpenChange={setUpdateOpen} />
    </>
  );
}
