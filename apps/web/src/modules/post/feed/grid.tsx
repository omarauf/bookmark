import type { Post } from "@workspace/contracts/views/post";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { PostCard } from "../card";
import { CARD_MIN_WIDTH } from "../card/constant";
import { useDisplaySettingsStore } from "../controls/display-setting-store";
import { useLayoutStore } from "../controls/layout-store";
import { usePreviewStore } from "../controls/preview-store";
import { usePostNavigation } from "../controls/use-post-navigation";
import { PostDialog } from "../dialog";

type Props = {
  posts?: Post[];
};

export function PostGridFeed({ posts = [] }: Props) {
  const flatItems = posts;
  usePostNavigation(flatItems);

  const cardSize = useDisplaySettingsStore((s) => s.cardSize);
  const cardMinWidth = CARD_MIN_WIDTH[cardSize];

  return (
    <div
      className={cn("grid gap-4")}
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${cardMinWidth}px, 1fr))` }}
    >
      {flatItems?.map((post) => (
        <PostListCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostListCard({ post }: { post: Post }) {
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
