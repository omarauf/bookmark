import type { Post } from "@workspace/contracts/views/post";
import { cn } from "@/lib/utils";
import { fShortenNumber } from "@/utils/format-number";
import * as icons from "./icons";

type Props = {
  post: Post;
  className?: string;
};

export function Stats({ post, className }: Props) {
  const metadata = post.platform === "twitter" && post.kind === "post" ? post : undefined;

  if (!metadata) return null;

  return (
    <div className={cn("flex justify-between", className)}>
      <div className="flex items-center gap-2 text-sm opacity-60">
        <icons.Comment />
        <p>{fShortenNumber(metadata.replies)}</p>
      </div>

      <div className="flex items-center gap-2 text-sm opacity-60">
        <icons.ReTweet />
        <p>{fShortenNumber(metadata.retweets)}</p>
      </div>

      <div className="flex items-center gap-2 text-sm opacity-60">
        <icons.Like />
        <p>{fShortenNumber(metadata.likes)}</p>
      </div>

      <div className="flex items-center gap-2 text-sm opacity-60">
        <icons.Bookmark />
        <p>{fShortenNumber(metadata.bookmarks)}</p>
      </div>

      <div className="flex items-center gap-2 text-sm opacity-60">
        <icons.Bookmark />
        <p>{fShortenNumber(metadata.views)}</p>
      </div>
    </div>
  );
}
