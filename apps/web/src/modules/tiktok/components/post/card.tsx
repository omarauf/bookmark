import type { Post } from "@workspace/contracts/post";
import { memo } from "react";
import { staticFile } from "@/api/static-file";
import { Card, CardContent } from "@/components/ui/card";
import { LazyImage } from "@/components/ui/lazy-image";
import { fDate } from "@/utils/format-time";
import { UserAvatar } from "../avatar";
import { getThumbnailUrl } from "./utils";

type Props = {
  post: Post;
  onClick: (postId: string) => void;
};

export function _PostCard({ post, onClick }: Props) {
  const { media } = post;
  const thumbnail = getThumbnailUrl(media[0]);

  return (
    <Card
      className="cursor-pointer gap-3 overflow-hidden pt-0 pb-3"
      onClick={() => onClick(post.id)}
    >
      <LazyImage src={staticFile(thumbnail)} className="aspect-square" />

      <CardContent className="flex flex-row items-center justify-between px-1">
        <div className="flex max-w-[60%] flex-row gap-2 overflow-hidden">
          <UserAvatar creator={post.creator} size="small" />
          <p className="flex items-center text-sm">{post.creator.username}</p>
        </div>

        <p className="text-sm">{fDate(post.createdAt)}</p>
      </CardContent>
    </Card>
  );
}

export const PostCard = memo(_PostCard, (prevProps, nextProps) => {
  return prevProps.post === nextProps.post;
});
