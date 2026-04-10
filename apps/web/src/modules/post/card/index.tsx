import type { Post } from "@workspace/contracts/post";
import { useShallow } from "zustand/react/shallow";
import { staticFile } from "@/api/static-file";
import { Card, CardContent } from "@/components/ui/card";
import { LazyImage } from "@/components/ui/lazy-image";
import { cn } from "@/lib/utils";
import { CreatorAvatar } from "@/modules/creator/avatar";
import { fDate } from "@/utils/format-time";
import { useDisplaySettingsStore } from "../controls/display-setting-store";
import { getThumbnailUrl } from "../utils";

type Props = {
  post: Post;
  onClick: (id?: string) => void;
  className?: string;
};

export function PostCard({ post, onClick, className }: Props) {
  const { media } = post;
  const thumbnail = getThumbnailUrl(media);

  const [aspectRatio, thumbnailScale, showCardInfo, cardSize] = useDisplaySettingsStore(
    useShallow((s) => [s.aspectRatio, s.thumbnailScale, s.showCardInfo, s.cardSize]),
  );

  return (
    <Card
      className={cn(
        "cursor-pointer gap-0 overflow-hidden p-0",
        { S: "rounded-sm", M: "rounded-md", L: "rounded-lg" }[cardSize],
        className,
      )}
      onClick={() => onClick(post.id)}
    >
      <LazyImage
        src={staticFile(thumbnail)}
        className={cn(
          {
            landscape: "aspect-video",
            square: "aspect-square",
            portrait: "aspect-3/4",
          }[aspectRatio],
          {
            fit: "object-contain",
            fill: "object-cover",
          }[thumbnailScale],
        )}
      />

      {showCardInfo && (
        <CardContent className="flex flex-row items-center justify-between px-1 py-2">
          <div className="flex max-w-[60%] flex-row gap-2 overflow-hidden">
            <CreatorAvatar creator={post.creator} size="small" />
            <p className="flex items-center text-nowrap text-sm">{post.creator.username}</p>
          </div>

          <p className="text-sm">{fDate(post.createdAt)}</p>
        </CardContent>
      )}
    </Card>
  );
}
