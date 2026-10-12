import type { Post } from "@workspace/contracts/views/post";
import { Music2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  PostCaption,
  PostDates,
  PostDialogHeader,
  PostDialogMedia,
  PostStatistics,
} from "../dialog-parts";

export function TiktokDialogContent({ post }: { post: Post }) {
  if (post.platform !== "tiktok") return null;

  return (
    <div className="flex min-h-0 flex-col lg:h-full lg:flex-row">
      {post.media.length > 0 && (
        <PostDialogMedia
          media={post.media}
          className="h-[35dvh] shrink-0 bg-background/90 lg:h-full lg:w-[60%]"
        />
      )}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PostDialogHeader post={post} />
        <Separator />
        <ScrollArea className="h-64 min-h-0 lg:h-auto lg:flex-1">
          <div className="flex flex-col gap-6 p-5">
            <PostCaption text={post.caption} className="wrap-break-word text-sm/7" />
            {post.music && (
              <div className="flex items-start gap-2 text-sm">
                <Music2 className="mt-0.5 size-4 shrink-0" />
                <p className="wrap-break-word">
                  {[post.music.title, post.music.authorName].filter(Boolean).join(" · ")}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        <footer className="shrink-0 px-5">
          <Separator />
          <PostStatistics
            statistics={[
              { label: "Likes", value: post.likes },
              { label: "Comments", value: post.comments },
              { label: "Shares", value: post.shares },
              { label: "Saves", value: post.collects },
              { label: "Plays", value: post.plays },
            ]}
          />
          <Separator />
          <PostDates post={post} />
        </footer>
      </div>
    </div>
  );
}
