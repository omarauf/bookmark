import type { Post } from "@workspace/contracts/views/post";
import { Bookmark, Eye, Forward, Heart, MessageCircle, Music2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { fShortenNumber } from "@/utils/format-number";
import { PostCaption, PostDates, PostDialogHeader, PostDialogMedia } from "../dialog-parts";

const CAPTION_PREVIEW_LENGTH = 100;

export function TiktokDialogContent({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false);
  if (post.platform !== "tiktok") return null;

  const hasMedia = post.media.length > 0;
  const isLongCaption = (post.caption?.length ?? 0) > CAPTION_PREVIEW_LENGTH;
  const caption =
    !expanded && isLongCaption
      ? `${post.caption?.slice(0, CAPTION_PREVIEW_LENGTH)}…`
      : post.caption;

  return (
    <ScrollArea className="min-h-0" viewportProps={{ className: "max-h-[calc(100dvh-2rem)]" }}>
      <div className="flex min-h-0 flex-col">
        <div className={cn("relative", hasMedia && "aspect-9/16")}>
          {hasMedia && (
            <PostDialogMedia
              media={post.media}
              className="absolute inset-0"
              navigationClassName="top-20 bottom-auto"
            />
          )}
          <div className={cn(hasMedia && "absolute inset-x-0 top-0 bg-black/60")}>
            <PostDialogHeader post={post} />
          </div>
          <dl
            className={cn(
              "flex gap-3",
              hasMedia
                ? "absolute top-1/2 right-3 -translate-y-1/2 flex-col bg-black/40 p-2"
                : "flex-wrap justify-between px-4 py-3",
            )}
          >
            {[
              { label: "Likes", Icon: Heart, value: post.likes },
              { label: "Comments", Icon: MessageCircle, value: post.comments },
              { label: "Shares", Icon: Forward, value: post.shares },
              { label: "Saves", Icon: Bookmark, value: post.collects },
            ].map(({ label, Icon, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <dt>
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="sr-only">{label}</span>
                </dt>
                <dd className="font-semibold text-xs tabular-nums">{fShortenNumber(value)}</dd>
              </div>
            ))}
          </dl>
          <div
            className={cn(
              "flex flex-col gap-2 p-4",
              hasMedia &&
                "absolute inset-x-0 bottom-14 bg-linear-to-t from-black/90 to-transparent pt-8",
            )}
          >
            <ScrollArea
              className="min-h-0"
              viewportProps={{ className: "max-h-[min(25dvh,10rem)]" }}
            >
              <PostCaption text={caption} className={cn("text-sm/6", hasMedia && "pr-14")} />
            </ScrollArea>
            {isLongCaption && (
              <Button
                variant="ghost"
                size="xs"
                className="self-start px-0 hover:underline"
                aria-expanded={expanded}
                onClick={() => setExpanded((previous) => !previous)}
              >
                {expanded ? "See less" : "See more"}
              </Button>
            )}
            {post.music && (
              <div className="flex min-w-0 items-center gap-2 text-xs">
                <Music2 className="size-3 shrink-0" />
                <span className="truncate" title={post.music.title}>
                  {[post.music.title, post.music.authorName].filter(Boolean).join(" · ")}
                </span>
              </div>
            )}
          </div>
        </div>
        <footer className="shrink-0 px-4">
          <div className="flex items-center gap-2 pt-2 text-white/65 text-xs">
            <Eye className="size-3" aria-hidden="true" />
            <span>{fShortenNumber(post.plays)} plays</span>
          </div>
          <PostDates post={post} />
        </footer>
      </div>
    </ScrollArea>
  );
}
