import type { Post } from "@workspace/contracts/views/post";
import { useCallback, useEffect } from "react";
import { usePreviewStore } from "./preview-store";

export function usePostNavigation(posts: Post[] = []) {
  const openPostId = usePreviewStore((s) => s.post?.id);
  const setPost = usePreviewStore((s) => s.setSelectedPost);

  const handleNavigation = useCallback(
    (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing)
        return;
      if (
        event.target instanceof HTMLElement &&
        event.target.closest(
          'input, textarea, select, video, audio, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="slider"], [role="spinbutton"], [role="radiogroup"], [role="listbox"], [role="menu"], [role="tree"], [role="tablist"]',
        )
      )
        return;
      if (!openPostId) return;

      const currentIndex = posts.findIndex((post) => post.id === openPostId);
      if (currentIndex === -1) return;

      event.preventDefault();
      event.stopPropagation();

      const direction = event.key === "ArrowLeft" ? -1 : 1;
      const targetIndex = currentIndex + direction;

      if (targetIndex >= 0 && targetIndex < posts.length) {
        setPost(posts[targetIndex]);
      }
    },
    [posts, openPostId, setPost],
  );

  useEffect(() => {
    // Capture arrows before the dialog stops them from bubbling to document.
    document.addEventListener("keydown", handleNavigation, true);
    return () => {
      document.removeEventListener("keydown", handleNavigation, true);
    };
  }, [handleNavigation]);

  return { openPostId };
}
