import type { Post } from "@workspace/contracts/post";
import { staticFile } from "@/api/static-file";
import { Card, CardContent } from "@/components/ui/card";
import { LazyImage } from "@/components/ui/lazy-image";
import { CreatorAvatar } from "@/modules/creator/avatar";
import { fDate } from "@/utils/format-time";
import { getThumbnailUrl } from "./utils";

type Props = {
  post: Post;
  onClick: (id?: string) => void;
};

export function PostCard({ post, onClick }: Props) {
  const { media } = post;
  const thumbnail = getThumbnailUrl(media);

  return (
    <Card
      className="cursor-pointer gap-3 overflow-hidden pt-0 pb-3"
      onClick={() => onClick(post.id)}
    >
      <LazyImage src={staticFile(thumbnail)} className="aspect-square" />

      <CardContent className="flex flex-row items-center justify-between px-1">
        <div className="flex max-w-[60%] flex-row gap-2 overflow-hidden">
          <CreatorAvatar creator={post.creator} size="small" />
          <p className="flex items-center text-nowrap text-sm">{post.creator.username}</p>
        </div>

        <p className="text-sm">{fDate(post.createdAt)}</p>
      </CardContent>
    </Card>
  );
}
