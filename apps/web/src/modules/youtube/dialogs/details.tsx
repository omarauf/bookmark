import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Youtube } from "@workspace/contracts/views/youtube";
import { cn } from "cn";
import {
  Calendar,
  Clock,
  Download,
  ExternalLink,
  Eye,
  HardDrive,
  Heart,
  MessageSquare,
  RotateCw,
  Tv,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { staticFile } from "@/api/static-file";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { KeyValue } from "@/components/ui/key-value";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { orpc } from "@/integrations/orpc";
import { getError } from "@/utils/error";
import { formatDuration } from "@/utils/format-number";
import { fDate } from "@/utils/format-time";
import { YoutubeDownloadDialog } from "./download";
import { YoutubeUpdateForm } from "./update-form";

type Props = {
  youtube: Youtube;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tab: "details" | "update";
  onTabChange: (tab: "details" | "update") => void;
};

const mediaActionClassName =
  "size-10 rounded-full border-white/20 bg-black/80 text-white shadow-sm hover:bg-black/90 hover:text-white";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function YoutubeDetailsDialog({ youtube, open, onOpenChange, tab, onTabChange }: Props) {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const queryClient = useQueryClient();
  const downloadedVideo = youtube.media.find((media) => media.type === "video");
  const refreshMutation = useMutation(
    orpc.youtube.refresh.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: orpc.youtube.list.key() });
        toast.success("Details refreshed");
      },
      onError: (error) => toast.error(getError(error, "Could not refresh details")),
    }),
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="flex h-[90vh] w-full flex-col gap-0 overflow-hidden border border-border/50 bg-background p-0 shadow-2xl sm:h-[min(85vh,48rem)] sm:max-w-6xl sm:flex-row"
          initialFocus={false}
        >
          <DialogTitle className="sr-only">{youtube.caption ?? youtube.externalId}</DialogTitle>
          <DialogDescription className="sr-only">
            Detailed information about {youtube.caption ?? youtube.externalId}
          </DialogDescription>

          {/* Media Column */}
          <div className="relative flex h-[30vh] w-full shrink-0 items-center overflow-hidden bg-black sm:h-full sm:w-3/5">
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

            <div className="absolute top-3 right-12 flex items-center gap-2 sm:right-3">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className={mediaActionClassName}
                      aria-label={
                        refreshMutation.isPending ? "Refreshing details" : "Refresh details"
                      }
                      aria-busy={refreshMutation.isPending}
                      onClick={() => refreshMutation.mutate({ id: youtube.id })}
                      disabled={refreshMutation.isPending}
                    />
                  }
                >
                  <RotateCw className={refreshMutation.isPending ? "animate-spin" : undefined} />
                </TooltipTrigger>
                <TooltipContent side="bottom">Refresh details</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className={mediaActionClassName}
                      aria-label="Download video"
                      onClick={() => setDownloadOpen(true)}
                    />
                  }
                >
                  <Download />
                </TooltipTrigger>
                <TooltipContent side="bottom">Download video</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <a
                      href={youtube.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open on YouTube"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        mediaActionClassName,
                      )}
                    />
                  }
                >
                  <ExternalLink />
                </TooltipTrigger>
                <TooltipContent side="bottom">Open on YouTube</TooltipContent>
              </Tooltip>
            </div>

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

          {/* Shared header and tabbed content */}
          <Tabs
            value={tab}
            onValueChange={(value) => {
              if (value === "details" || value === "update") onTabChange(value);
            }}
            className="min-h-0 min-w-0 flex-1 gap-0"
          >
            {/* Header */}
            <div className="shrink-0 px-5 pt-5">
              <h2 className="font-semibold text-base text-foreground leading-snug">
                {youtube.caption ?? youtube.externalId}
              </h2>
            </div>

            <div className="shrink-0 border-border/50 border-b px-5 py-2">
              <TabsList variant="line" aria-label="Video information">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="update">Update</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="details" className="min-h-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-2 border-border/50 border-b px-5 py-2">
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
                  <div className="px-5 py-2">
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
                                <span className="text-[11px] text-foreground">
                                  {m.key.split("/").pop()}
                                </span>
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
            </TabsContent>
            <TabsContent
              value="update"
              keepMounted
              className="flex min-h-0 flex-col data-hidden:hidden"
            >
              <YoutubeUpdateForm youtube={youtube} onClose={() => onOpenChange(false)} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <YoutubeDownloadDialog youtube={youtube} open={downloadOpen} onOpenChange={setDownloadOpen} />
    </>
  );
}
