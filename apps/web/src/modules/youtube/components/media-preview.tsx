import type { Youtube } from "@workspace/contracts/views/youtube";
import { cn } from "cn";
import { HardDrive, Tv } from "lucide-react";
import { staticFile } from "@/api/static-file";
import { formatDuration } from "@/utils/format-number";

type Props = {
  youtube: Youtube;
  className?: string;
};

export function YoutubeMediaPreview({ youtube, className }: Props) {
  const downloadedVideo = youtube.media.find((media) => media.type === "video");

  return (
    <div
      className={cn(
        "relative flex min-h-0 min-w-0 items-center overflow-hidden bg-black",
        className,
      )}
    >
      {downloadedVideo ? (
        <video
          src={staticFile(downloadedVideo.key)}
          controls
          autoPlay
          className="h-full w-full object-contain"
          preload="metadata"
        >
          <track kind="captions" src={undefined} label="No captions" />
        </video>
      ) : youtube.thumbnail ? (
        <img
          src={youtube.thumbnail}
          alt={youtube.caption ?? youtube.externalId}
          className="w-full object-contain"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3">
          <Tv className="h-16 w-16 text-muted-foreground/20" />
          <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
            No Thumbnail
          </span>
        </div>
      )}

      {/* Duration Badge */}
      <div className="absolute right-3 bottom-3 bg-black/80 px-2 py-1 font-medium text-[10px] text-white">
        {formatDuration(youtube.duration)}
      </div>

      {/* Downloaded Badge */}
      {downloadedVideo && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/80 px-2 py-1 text-[10px] text-white">
          <HardDrive className="h-3 w-3" />
          <span>Downloaded</span>
        </div>
      )}
    </div>
  );
}
