import type { Post } from "@workspace/contracts/views/post";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PostUpdateForm } from "../components/update-form";
import { InstagramDialogContent } from "./instagram/dialog";
import { TiktokDialogContent } from "./tiktok/dialog";
import { TwitterDialogContent } from "./twitter/dialog";

type Props = {
  post: Post;
  onClose: () => void;
};

export function PostDialog({ post, onClose }: Props) {
  const { platform } = post;

  const onOpenChange = (open: boolean) => {
    if (open) return;
    onClose();
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "grid max-h-[90dvh] grid-cols-1 gap-0 overflow-y-auto rounded-none bg-black p-0 text-white lg:h-[90dvh] lg:grid-cols-[minmax(0,17fr)_minmax(20rem,8fr)] lg:overflow-hidden",
          (platform === "instagram" || platform === "tiktok") && "sm:max-w-[90vw]",
          platform === "twitter" && "sm:max-w-5xl",
        )}
        initialFocus={false}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{`Post by ${post.creator.name || post.creator.username}`}</DialogTitle>
        <DialogDescription className="sr-only">Post content</DialogDescription>

        <section className="min-h-0 min-w-0">
          <PostContent key={post.id} post={post} />
        </section>

        <section className="flex min-h-0 min-w-0 flex-col border-white/20 border-t lg:border-t-0 lg:border-l">
          <header className="shrink-0 border-white/20 border-b px-5 py-4">Update item</header>
          <ScrollArea className="h-[min(36rem,75dvh)] min-h-0 lg:h-auto lg:flex-1">
            <PostUpdateForm post={post} />
          </ScrollArea>
        </section>
      </DialogContent>
    </Dialog>
  );
}

function PostContent({ post }: { post: Post }) {
  if (post.platform === "instagram") return <InstagramDialogContent post={post} />;

  if (post.platform === "twitter") return <TwitterDialogContent post={post} />;

  if (post.platform === "tiktok") return <TiktokDialogContent post={post} />;

  return null;
}
