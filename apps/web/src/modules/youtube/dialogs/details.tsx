import type { Youtube } from "@workspace/contracts/views/youtube";
import { Calendar, Clock, ExternalLink, Eye, Heart, MessageSquare, Tv, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { KeyValue } from "@/components/ui/key-value";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDuration } from "@/utils/format-number";
import { fDate } from "@/utils/format-time";

type Props = {
  youtube: Youtube;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function YoutubeDetailsDialog({ youtube, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex aspect-1152/1037 h-auto w-full flex-col gap-0 overflow-hidden border border-border/50 bg-background p-0 shadow-2xl sm:max-w-6xl sm:flex-row"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">{youtube.caption ?? youtube.externalId}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {youtube.caption ?? youtube.externalId}
        </DialogDescription>

        {/* Thumbnail Column */}
        <div className="relative flex aspect-2/3 h-fit w-3/5 shrink-0 items-center overflow-hidden bg-muted">
          {youtube.thumbnail ? (
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
        </div>

        {/* Details Column */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="shrink-0 space-y-2 border-border/50 border-b p-5 pr-10">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-base text-foreground leading-snug">
                {youtube.caption ?? youtube.externalId}
              </h2>

              <Button asChild variant="outline" size="xs" className="text-[10px]">
                <a href={youtube.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                  YouTube
                </a>
              </Button>
            </div>

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
                {formatCount(youtube.views)} views
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Heart className="h-3 w-3" />
                {formatCount(youtube.likes)} likes
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                {formatCount(youtube.comments)} comments
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
            <ScrollArea className="min-h-0 grow">
              <div className="p-5">
                <p className="whitespace-pre-wrap text-[11px] text-foreground/80 leading-relaxed">
                  {youtube.description}
                </p>
              </div>
            </ScrollArea>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
