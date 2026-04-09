import type { Post } from "@workspace/contracts/post";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CARD_MIN_WIDTH } from "../card/constant";
import { useDisplaySettingsStore } from "../controls/store";
import { PostListCard } from "./card";

type Props = {
  posts: Post[];
  className?: string;
};

export function PostList({ posts, className }: Props) {
  const [openPostId, setOpenPostId] = useState<string>();

  const cardSize = useDisplaySettingsStore((s) => s.cardSize);

  const handleNavigation = useCallback(
    async (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (!openPostId) return;

      const currentIndex = posts.findIndex((post) => post.id === openPostId);
      if (currentIndex === -1) return;

      const direction = event.key === "ArrowLeft" ? -1 : 1;
      const targetIndex = currentIndex + direction;

      if (targetIndex >= 0 && targetIndex < posts.length) {
        setOpenPostId(posts[targetIndex].id);
      }
    },
    [posts, openPostId],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleNavigation);
    return () => {
      document.removeEventListener("keydown", handleNavigation);
    };
  }, [handleNavigation]);

  const cardMinWidth = CARD_MIN_WIDTH[cardSize];

  return (
    <div
      className={cn("grid gap-4", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${cardMinWidth}px, 1fr))`,
      }}
    >
      {posts.map((post) => (
        <PostListCard
          key={post.id}
          post={post}
          isOpen={openPostId === post.id}
          onClick={(id) => setOpenPostId(id)}
        />
      ))}
    </div>
  );
}
