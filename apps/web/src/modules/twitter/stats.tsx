import type { Post } from "@workspace/contracts/post";
import { fShortenNumber } from "@/utils/format-number";
import * as icons from "./icons";

export function Stats({ post }: { post: Post }) {
  const metadata =
    post.metadata.platform === "twitter" && post.metadata.kind === "post"
      ? post.metadata
      : undefined;

  if (!metadata) return null;

  return (
    <div dir="ltr" className="flex justify-between">
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
