import type { Post } from "@workspace/contracts/post";
import { useCallback, useEffect } from "react";
import { usePreviewStore } from "./preview-store";

export function usePostNavigation(posts: Post[] = []) {
  const openPostId = usePreviewStore((s) => s.post?.id);
  const setPost = usePreviewStore((s) => s.setSelectedPost);

  const handleNavigation = useCallback(
    async (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (!openPostId) return;

      const currentIndex = posts.findIndex((post) => post.id === openPostId);
      if (currentIndex === -1) return;

      const direction = event.key === "ArrowLeft" ? -1 : 1;
      const targetIndex = currentIndex + direction;

      if (targetIndex >= 0 && targetIndex < posts.length) {
        setPost(posts[targetIndex]);
      }
    },
    [posts, openPostId, setPost],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleNavigation);
    return () => {
      document.removeEventListener("keydown", handleNavigation);
    };
  }, [handleNavigation]);

  return { openPostId };
}
