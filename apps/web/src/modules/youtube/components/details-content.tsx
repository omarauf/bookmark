import type { Youtube } from "@workspace/contracts/views/youtube";
import { Calendar, Clock, Eye, HardDrive, Heart, MessageSquare, Tv, User } from "lucide-react";
import { staticFile } from "@/api/static-file";
import { Badge } from "@/components/ui/badge";
import { KeyValue } from "@/components/ui/key-value";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDuration, fShortenNumber } from "@/utils/format-number";
import { fDate } from "@/utils/format-time";

type Props = {
  youtube: Youtube;
};

export function YoutubeDetailsContent({ youtube }: Props) {
  const downloadedVideo = youtube.media.find((media) => media.type === "video");

  return (
    <ScrollArea className="h-full" viewportProps={{ className: "flex flex-col" }}>
      <div className="flex flex-col gap-2 border-border/50 border-b px-5 py-2">
        <h2 className="pt-3 pb-1 font-semibold text-base text-foreground leading-snug">
          {youtube.caption ?? youtube.externalId}
        </h2>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <User className="h-3 w-3" />
            {youtube.channelTitle}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {fDate(youtube.publishedAt)}
          </span>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Eye className="h-3 w-3" />
            {fShortenNumber(youtube.views)} views
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Heart className="h-3 w-3" />
            {fShortenNumber(youtube.likes)} likes
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            {fShortenNumber(youtube.comments)} comments
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDuration(youtube.duration)}
          </span>
        </div>

        {youtube.tags && youtube.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {youtube.tags.map((t) => (
              <Badge
                key={t}
                size="sm"
                variant="secondary"
                className="text-muted-foreground uppercase"
              >
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      {youtube.description && (
        <div className="grow px-5 py-2">
          <p className="whitespace-pre-wrap text-[11px] text-foreground/80 leading-relaxed">
            {youtube.description}
          </p>
        </div>
      )}

      {/* Downloaded Media */}
      {downloadedVideo && (
        <>
          <Separator className="shrink-0 bg-border/50" />
          <div className="shrink-0 space-y-2 border-border/50 border-b px-5 py-2">
            <h3 className="font-medium text-[11px] text-foreground">Downloaded Media</h3>
            <div className="space-y-2">
              {youtube.media
                .filter((m) => m.type === "video")
                .map((m) => (
                  <a
                    key={m.key}
                    href={staticFile(m.key)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-md border border-border/30 px-3 py-2 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] text-foreground">{m.key.split("/").pop()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      {m.width > 0 && m.height > 0 && (
                        <span>
                          {m.width}×{m.height}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </>
      )}

      <Separator className="shrink-0 bg-border/50" />

      {/* Youtube Grid */}
      <div className="grid shrink-0 grid-cols-1 gap-0 sm:grid-cols-2">
        {/* Category */}
        {youtube.categoryId && (
          <KeyValue
            className="border-border/30 border-b"
            icon={<Tv className="h-3 w-3" />}
            label="Category ID"
            value={youtube.categoryId}
          />
        )}

        {/* Channel ID */}
        {youtube.channelId && (
          <KeyValue
            className="border-border/30 border-b"
            icon={<User className="h-3 w-3" />}
            label="Channel ID"
            value={youtube.channelId}
          />
        )}
      </div>
    </ScrollArea>
  );
}
