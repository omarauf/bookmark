import type { Post } from "@workspace/contracts/views/post";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { InstagramDialogContent } from "./instagram/dialog";
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
          "pointer-events-none flex w-max max-w-full flex-row sm:max-w-full",
          platform === "instagram" && "h-[95%]",
          platform === "twitter" && "w-150",
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{`Post by ${post.creator.name}`}</DialogTitle>
        <DialogDescription className="sr-only">Post content</DialogDescription>

        <PostContent post={post} />
      </DialogContent>
    </Dialog>
  );
}

function PostContent({ post }: { post: Post }) {
  if (post.platform === "instagram") return <InstagramDialogContent post={post} />;

  if (post.platform === "twitter") return <TwitterDialogContent post={post} />;

  return null;
}
