import { useLayoutStore } from "../controls/layout-store";
import { usePreviewStore } from "../controls/preview-store";
import { Content } from "../dialog/content";

export function PostPreview() {
  const post = usePreviewStore((s) => s.post);

  const isPreviewOpen = useLayoutStore((s) => s.isPreviewVisible());

  if (!post || !isPreviewOpen) {
    return <div className="flex h-full items-center justify-center">Select a post to preview</div>;
  }

  return <Content post={post} />;
}
