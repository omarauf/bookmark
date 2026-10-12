import { ScrollArea } from "@/components/ui/scroll-area";
import { PostUpdateForm } from "../components/update-form";
import { useLayoutStore } from "../controls/layout-store";
import { usePreviewStore } from "../controls/preview-store";
import { PostItem } from "../views/item";

export function PostPreview() {
  const post = usePreviewStore((s) => s.post);

  const isPreviewOpen = useLayoutStore((s) => s.isPreviewVisible());

  if (!post || !isPreviewOpen) {
    return <div className="flex h-full items-center justify-center">Select a post to preview</div>;
  }

  return (
    <ScrollArea className="h-full min-h-0 bg-black text-white">
      <PostItem post={post} className="h-auto border-none bg-transparent" />

      <section className="mt-5 border-white/20 border-t">
        <header className="border-white/20 border-b px-5 py-4">Update item</header>
        <PostUpdateForm post={post} />
      </section>
    </ScrollArea>
  );
}
