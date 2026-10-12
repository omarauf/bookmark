import type { Post } from "@workspace/contracts/views/post";
import { cn } from "@/lib/utils";
import { CARD_MIN_WIDTH } from "../card/constant";
import { useDisplaySettingsStore } from "../controls/display-setting-store";
import { useLayoutStore } from "../controls/layout-store";
import { usePreviewStore } from "../controls/preview-store";
import { PostCard } from "../views/card";
import { PostDialog } from "../views/dialog";

type Props = {
  posts?: Post[];
};

export function PostGridFeed({ posts = [] }: Props) {
  const flatItems = posts;

  const cardSize = useDisplaySettingsStore((s) => s.cardSize);
  const cardMinWidth = CARD_MIN_WIDTH[cardSize];
  const isPreview = useLayoutStore((s) => s.isPreviewVisible());
  const selectedPost = usePreviewStore((s) => s.post);
  const setSelectedPost = usePreviewStore((s) => s.setSelectedPost);

  return (
    <div
      className={cn("grid gap-4")}
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${cardMinWidth}px, 1fr))` }}
    >
      {flatItems?.map((post) => (
        <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
      ))}

      {!isPreview && selectedPost && (
        <PostDialog post={selectedPost} onClose={() => setSelectedPost(undefined)} />
      )}
    </div>
  );
}
