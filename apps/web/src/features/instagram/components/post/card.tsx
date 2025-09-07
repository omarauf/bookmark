import type { PopulatedInstagramPost } from "@workspace/contracts/instagram/post";
import { Card, CardContent } from "@workspace/ui/components/card";
import { LazyImage } from "@workspace/ui/components/lazy-image";
import { memo } from "react";
import { staticFile } from "@/api/static-file";
import { fDate } from "@/utils/format-time";
import { UserAvatar } from "../avatar";
import { getThumbnailUrl } from "./utils";

type Props = {
  post: PopulatedInstagramPost;
  onClick: (postId: string) => void;
};

export function _PostCard({ post, onClick }: Props) {
  const { media } = post;
  const thumbnail = getThumbnailUrl(media);

  return (
    <Card
      className="cursor-pointer gap-3 overflow-hidden pt-0 pb-3"
      onClick={() => onClick(post.postId)}
    >
      <LazyImage src={staticFile(thumbnail)} className="aspect-square" />

      <CardContent className="flex flex-row items-center justify-between px-1">
        <div className="flex max-w-[60%] flex-row gap-2 overflow-hidden">
          <UserAvatar user={post.creator} size="small" />
          <p className="flex items-center text-sm">{post.creator.username}</p>
        </div>

        <p className="text-sm">{fDate(post.savedAt)}</p>
      </CardContent>
    </Card>
  );
}

export const PostCard = memo(_PostCard, (prevProps, nextProps) => {
  return prevProps.post === nextProps.post;
});
