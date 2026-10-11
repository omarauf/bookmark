import type { Post } from "@workspace/contracts/views/post";
import { MapPin, Music2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  PostCaption,
  PostDates,
  PostDialogHeader,
  PostDialogMedia,
  PostStatistics,
} from "../dialog-parts";

export function InstagramDialogContent({ post }: { post: Post }) {
  if (post.platform !== "instagram") return null;

  return (
    <div className="flex min-h-0 flex-col md:flex-row">
      {post.media.length > 0 && (
        <PostDialogMedia
          media={post.media}
          className="h-[90vh] shrink-0 bg-background/90 md:w-[60%]"
        />
      )}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PostDialogHeader post={post} />
        <Separator />
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-6 p-5">
            <PostCaption text={post.caption} className="wrap-break-word text-sm/7" />
            {(post.location || post.music) && (
              <div className="flex flex-col gap-4 text-sm">
                {post.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    <div className="min-w-0">
                      <p>{post.location.name}</p>
                      <p className="wrap-break-word text-white/65 text-xs">
                        {[post.location.city, post.location.address].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                )}
                {post.music && (
                  <div className="flex items-start gap-2">
                    <Music2 className="mt-0.5 size-4 shrink-0" />
                    <p className="wrap-break-word">
                      {post.music.original
                        ? "Original audio"
                        : [post.music.title, post.music.artist].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                )}
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
              { label: "Views", value: post.views },
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
