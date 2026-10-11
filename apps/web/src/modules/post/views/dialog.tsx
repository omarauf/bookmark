import type { Post } from "@workspace/contracts/views/post";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { InstagramDialogContent } from "./instagram/dialog";
import { TiktokDialogContent } from "./tiktok/dialog";
import { TwitterDialogContent } from "./twitter/dialog";

type Props = {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PostDialog({ post, open, onOpenChange }: Props) {
  const { platform } = post;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex flex-col gap-0 overflow-hidden rounded-none bg-black p-0 text-white",
          platform === "instagram" && "sm:max-w-7xl",
          platform === "twitter" && "sm:max-w-xl",
          platform === "tiktok" && "sm:max-w-104",
          platform === "tiktok" &&
            post.media.length > 0 &&
            "max-w-[min(26rem,calc(100dvw-2rem),max(16rem,calc((100dvh-8rem)*9/16)))] sm:max-w-[min(26rem,max(16rem,calc((100dvh-8rem)*9/16)))]",
        )}
        initialFocus={false}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{`Post by ${post.creator.name || post.creator.username}`}</DialogTitle>
        <DialogDescription className="sr-only">Post content</DialogDescription>

        <PostContent key={post.id} post={post} />
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
