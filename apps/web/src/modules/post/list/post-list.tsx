import type { Post } from "@workspace/contracts/post";
import { Fragment } from "react";
import { PostCard } from "../card";
import { useLayoutStore } from "../controls/layout-store";
import { usePreviewStore } from "../controls/preview-store";
import { PostDialog } from "../dialog";

type Props = {
  post: Post;
};

export function PostListCard({ post }: Props) {
  const isPreview = useLayoutStore((s) => s.isPreviewVisible());

  const isPostOpen = usePreviewStore((s) => s.post?.id === post.id);
  const onClick = usePreviewStore((s) => s.setSelectedPost);

  return (
    <Fragment key={post.id}>
      <PostCard post={post} onClick={() => onClick(post)} />

      {!isPreview && (
        <PostDialog post={post} open={isPostOpen} onOpenChange={() => onClick(undefined)} />
      )}
    </Fragment>
  );
}
