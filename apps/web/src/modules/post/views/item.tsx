import type { Post } from "@workspace/contracts/views/post";
import { cn } from "@/lib/utils";
import { InstagramItem } from "./instagram/item";
import { TiktokItem } from "./tiktok/item";
import { TwitterItem } from "./twitter/item";

type Props = {
  post: Post;
  className?: string;
};

export function PostItem({ post, className }: Props) {
  return (
    <div key={post.id} className={cn("h-full border text-card-foreground shadow-sm", className)}>
      <PostContent post={post} />
    </div>
  );
}

function PostContent({ post }: Props) {
  if (post.platform === "instagram") return <InstagramItem post={post} />;

  if (post.platform === "twitter") return <TwitterItem post={post} />;

  if (post.platform === "tiktok") return <TiktokItem post={post} />;

  return null;
}
