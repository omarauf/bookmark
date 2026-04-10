import { useCallback, useEffect, useState } from "react";

export function usePostNavigation<T extends { id: string }>(posts: T[] = []) {
  const [openPostId, setOpenPostId] = useState<string>();

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

  return { openPostId, setOpenPostId };
}
