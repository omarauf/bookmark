import type { Post } from "@workspace/contracts/post";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Content } from "./content";

type Props = {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PostDialog({ post, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="pointer-events-none flex h-[95%] w-max max-w-full flex-row sm:max-w-full"
        onOpenAutoFocus={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{`Post by ${post.creator.name}`}</DialogTitle>
        <DialogDescription className="sr-only">Instagram post content</DialogDescription>

        <Content post={post} />
      </DialogContent>
    </Dialog>
  );
}
