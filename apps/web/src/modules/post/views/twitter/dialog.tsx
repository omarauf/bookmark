import type { Post } from "@workspace/contracts/views/post";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CreatorAvatar } from "@/modules/creator/avatar";
import { fDateTime } from "@/utils/format-time";
import {
  PostCaption,
  PostDates,
  PostDialogHeader,
  PostDialogMedia,
  PostStatistics,
} from "../dialog-parts";

export function TwitterDialogContent({ post }: { post: Post }) {
  if (post.platform !== "twitter") return null;

  return (
    <div className="flex min-h-0 flex-col lg:h-full">
      <PostDialogHeader post={post} />
      <Separator />
      <ScrollArea
        className="min-h-0 lg:flex-1"
        viewportProps={{ className: "max-h-[calc(90dvh-5rem)]" }}
      >
        <div className="flex flex-col gap-5 p-5">
          <PostCaption text={post.caption} className="wrap-break-word text-xl/8" />
          {post.quoteItem && (
            <blockquote className="flex min-w-0 flex-col gap-3 border-white/35 border-l-2 pl-4">
              <a
                href={post.quoteItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-2 hover:underline"
              >
                <CreatorAvatar creator={post.quoteItem.creator} className="size-6" />
                <span className="min-w-0 truncate font-semibold text-xs">
                  {post.quoteItem.creator.name || post.quoteItem.creator.username}
                  <span className="ml-2 font-normal text-white/65">
                    @{post.quoteItem.creator.username}
                  </span>
                </span>
              </a>
              <PostCaption text={post.quoteItem.caption} className="wrap-break-word text-sm/6" />
              {post.quoteItem.media.length > 0 && (
                <PostDialogMedia
                  key={post.quoteItem.id}
                  media={post.quoteItem.media}
                  className="h-[min(18rem,35dvh)]"
                />
              )}
              <time
                dateTime={post.quoteItem.publishedAt.toISOString()}
                className="text-white/65 text-xs"
              >
                {fDateTime(post.quoteItem.publishedAt)}
              </time>
            </blockquote>
          )}
          {post.media.length > 0 && (
            <PostDialogMedia media={post.media} className="h-[min(24rem,45dvh)]" />
          )}
          <footer>
            <PostDates post={post} />
            <Separator />
            <PostStatistics
              statistics={[
                { label: "Replies", value: post.replies },
                { label: "Reposts", value: post.retweets },
                { label: "Likes", value: post.likes },
                { label: "Bookmarks", value: post.bookmarks },
                { label: "Views", value: post.views },
              ]}
            />
          </footer>
        </div>
      </ScrollArea>
    </div>
  );
}
