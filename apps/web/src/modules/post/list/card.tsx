import type { Post } from "@workspace/contracts/post";
import { memo } from "react";
import { PostCard } from "../card";
import { PostDialog } from "../dialog";

type Props = {
  post: Post;
  isOpen: boolean;
  onClick: (id?: string) => void;
};

function PostListCardM({ post, isOpen, onClick }: Props) {
  return (
    <>
      <PostCard post={post} onClick={() => onClick(post.id)} />

      <PostDialog post={post} open={isOpen} onOpenChange={() => onClick(undefined)} />
    </>
  );
}

export const PostListCard = memo(PostListCardM, (prevProps, nextProps) => {
  // If the isOpen hasn't changed at all, don't re-render
  if (prevProps.isOpen === nextProps.isOpen) return true;

  // For all other cards, the isOpen changed re-render
  return false;
});
