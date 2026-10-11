import type { NormalizedMedia } from "@workspace/contracts/media";
import type { Post } from "@workspace/contracts/views/post";
import { ArrowUpRight, BadgeCheck, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { staticFile } from "@/api/static-file";
import { Button, buttonVariants } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { CreatorAvatar } from "@/modules/creator/avatar";
import { useDisplaySettingsStore } from "@/modules/post/controls/display-setting-store";
import { useAutoPlay } from "@/modules/post/hooks/use-auto-play";
import { fShortenNumber } from "@/utils/format-number";
import { fDateTime } from "@/utils/format-time";

export function PostCaption({ text, className }: { text?: string; className?: string }) {
  if (!text) return null;

  return (
    <p dir="auto" className={cn("wrap-break-word whitespace-pre-wrap text-sm/6", className)}>
      {text}
    </p>
  );
}

export function PostDialogHeader({ post }: { post: Post }) {
  return (
    <header className="flex shrink-0 items-center gap-3 p-4">
      <CreatorAvatar creator={post.creator} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="truncate font-semibold">
            {post.creator.name || post.creator.username}
          </span>
          {post.creator.verified && <BadgeCheck className="size-4 shrink-0" />}
        </div>
        <a
          href={post.creator.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-white/65 text-xs hover:underline"
        >
          @{post.creator.username}
        </a>
      </div>
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <ArrowUpRight />
      </a>
      <DialogClose render={<Button variant="ghost" size="icon" />}>
        <X />
      </DialogClose>
    </header>
  );
}

export function PostDates({ post }: { post: Post }) {
  return (
    <dl className="flex flex-col gap-1.5 py-3 text-xs">
      {[
        { label: "Published", date: post.publishedAt },
        { label: "Added", date: post.addedAt },
      ].map(({ label, date }) => (
        <div key={label} className="flex flex-wrap justify-between gap-x-3 gap-y-1">
          <dt className="text-white/65">{label}</dt>
          <dd>
            <time dateTime={date.toISOString()}>{fDateTime(date)}</time>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function PostStatistics({
  statistics,
}: {
  statistics: { label: string; value: number | undefined }[];
}) {
  return (
    <dl className="flex flex-wrap justify-between gap-x-5 gap-y-3 py-4">
      {statistics
        .filter((statistic) => statistic.value !== undefined)
        .map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <dt className="order-2 text-white/65 text-xs">{label}</dt>
            <dd className="font-semibold tabular-nums">{fShortenNumber(value ?? 0)}</dd>
          </div>
        ))}
    </dl>
  );
}

/** Displays one attachment at a time, preserving its full image or video frame. */
export function PostDialogMedia({
  media,
  className,
}: {
  media: Post["media"];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const current = media[index] ?? media[0];

  if (!current) {
    return (
      <Empty className={className}>
        <EmptyHeader>
          <EmptyTitle>No media</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className={cn("relative min-h-0 min-w-0 bg-black", className)}>
      <DialogAttachment key={current.key} media={current} index={index} />
      {media.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            disabled={index === 0}
            onClick={() => setIndex((previous) => previous - 1)}
            className="absolute top-1/2 left-3"
          >
            <ChevronLeft />
          </Button>
          <span className="absolute top-3 left-3 bg-black/80 px-2 py-1 text-xs tabular-nums">
            {index + 1} / {media.length}
          </span>
          <Button
            variant="secondary"
            size="icon"
            disabled={index === media.length - 1}
            onClick={() => setIndex((previous) => previous + 1)}
            className="absolute top-1/2 right-3"
          >
            <ChevronRight />
          </Button>
        </>
      )}
      {media.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {media.map((item, i) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "size-2 rounded-full transition-colors",
                index === i ? "bg-white" : "bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DialogAttachment({ media, index }: { media: NormalizedMedia; index: number }) {
  const autoPlay = useDisplaySettingsStore((state) => state.autoPlay);
  const videoRef = useAutoPlay(autoPlay);
  const className = "block size-full min-h-0 object-contain";

  if (media.type === "video") {
    return (
      <video
        ref={videoRef}
        src={staticFile(media.key)}
        poster={staticFile(media.thumbnail)}
        className={className}
        controls
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <img src={staticFile(media.key)} alt={`Post attachment ${index + 1}`} className={className} />
  );
}
