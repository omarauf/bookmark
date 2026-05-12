import type { Post } from "@workspace/contracts/views/post";
import { BarChart3, Bookmark, Eye, Heart, MessageCircle, Play, Repeat2 } from "lucide-react";
import { fShortenNumber } from "@/utils/format-number";
import { usePostContext } from "../utils/context";

export function Statistics() {
  const post = usePostContext();

  if (post.platform === "tiktok") return <TiktokStatistics post={post} />;

  if (post.platform === "instagram") return <InstagramStatistics post={post} />;

  if (post.platform === "twitter") return <TwitterStatistics post={post} />;

  return null;
}

function InstagramStatistics({ post }: { post: Post }) {
  if (post.platform !== "instagram") return null;

  return (
    <div className="flex justify-between">
      <IconNumber icon={Heart} number={post.likes} />

      {post.play && <IconNumber icon={Play} number={post.play} />}
      {post.view && <IconNumber icon={Eye} number={post.view} />}
    </div>
  );
}

function TiktokStatistics({ post }: { post: Post }) {
  if (post.platform !== "tiktok") return null;

  return (
    <div className="flex justify-between">
      <IconNumber icon={Heart} number={post.likes} />
    </div>
  );
}

function TwitterStatistics({ post }: { post: Post }) {
  if (post.platform !== "twitter") return null;

  return (
    <div className="flex justify-between text-muted-foreground text-sm">
      <IconNumber icon={MessageCircle} number={post.replies} />
      <IconNumber icon={Repeat2} number={post.retweets} />
      <IconNumber icon={Heart} number={post.likes} />
      <IconNumber icon={Bookmark} number={post.bookmarks} />
      <IconNumber icon={BarChart3} number={post.views} />
    </div>
  );
}

function IconNumber({ icon: Icon, number }: { icon: React.ElementType; number: number }) {
  return (
    <div className="flex items-center gap-1">
      <Icon className="h-4 w-4" />
      <span>{fShortenNumber(number)}</span>
    </div>
  );
}
