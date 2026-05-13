import type { Post } from "@workspace/contracts/views/post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatorAvatar } from "@/modules/creator/avatar";
import { fShortenNumber } from "@/utils/format-number";
import { fDateTime } from "@/utils/format-time";
import * as icons from "./common/icons";
import { TwitterMediaCard } from "./common/media";
import { Stats } from "./common/stats";
import { TwitterText } from "./common/text";
import { isVerified } from "./common/utils";

type Props = {
  post: Post;
};

export function TwitterDialogContent({ post }: Props) {
  if (post.platform !== "twitter") return null;

  return (
    <div className="flex w-full flex-col gap-4 text-card-foreground shadow-sm">
      <div className="relative">
        <div className="flex items-center gap-2">
          <CreatorAvatar creator={post.creator} className="size-9" />
          <div>
            <div className="flex items-center gap-1">
              <p className="font-bold text-sm">{post.creator.name || "N/A"}</p>
              {isVerified(post.creator) && <icons.Verified />}
            </div>
            <p className="font-medium text-xs opacity-60">@{post.creator.username}</p>
          </div>
        </div>

        <div className="absolute top-0 right-0">
          <a
            href={post.url}
            className="opacity-80 hover:opacity-100"
            target="_blank"
            rel="noopener"
          >
            <icons.Twitter />
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <TwitterText text={post.caption} />

        <TwitterMediaCard media={post.media} />

        {post.quoteItem && (
          <Card className="gap-2 pt-4 pb-0">
            <CardHeader className="px-4">
              <CardTitle className="flex items-center gap-1.5 text-xs">
                <CreatorAvatar creator={post.quoteItem.creator} className="size-6" />

                <p>{post.quoteItem.creator.name}</p>
                {post.quoteItem.creator.verified && <icons.Verified />}
                <p className="opacity-60">@{post.quoteItem.creator.username}</p>
                <p> {fDateTime(post.quoteItem.createdAt, "MMM DD, YYYY")}</p>
              </CardTitle>
            </CardHeader>

            <CardContent className="grow p-0">
              <TwitterText text={post.quoteItem.caption} className="mb-4 px-4" />

              <TwitterMediaCard
                media={post.quoteItem.media}
                className="aspect-video w-full rounded-t-none"
              />
            </CardContent>
          </Card>
        )}

        <p dir="ltr" className="flex items-center gap-1 text-xs opacity-60">
          <span>{fDateTime(post.createdAt, "hh:mm A · MMM DD, YYYY")}</span>·
          <span className="font-bold text-white">{fShortenNumber(post.views)}</span>
          <span className="opacity-60">views</span>
        </p>
      </div>

      <Stats post={post} className="w-full" />
    </div>
  );
}
