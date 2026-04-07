import type { Post } from "@workspace/contracts/post";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDisplaySettingsStore } from "../controls/store";
import { PostListCard } from "./card";

type Props = {
  posts: Post[];
};

export function PostList({ posts }: Props) {
  const [openPostId, setOpenPostId] = useState<string>();

  const cardSize = useDisplaySettingsStore((s) => s.cardSize);

  const handleNavigation = useCallback(
    async (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (!openPostId) return;

      const currentIndex = posts.findIndex((post) => post.id === openPostId);
      if (currentIndex === -1) return;

      // Submit current form before navigating
      // await selectedPostRef.current?.submit();

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

  return (
    <div
      // className="grid 3xl:grid-cols-6 4xl:grid-cols-7 grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      className={cn("grid gap-4")}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${cardSize === "S" ? 130 : cardSize === "M" ? 180 : 230}px, 1fr))`,
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
