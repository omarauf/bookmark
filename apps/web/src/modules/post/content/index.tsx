import type { Post } from "@workspace/contracts/views/post";
import { InstagramContent } from "./instagram";
import { TwitterContent } from "./twitter";

type Props = {
  post: Post;
};

export function PostContent({ post }: Props) {
  if (post.platform === "instagram") return <InstagramContent post={post} />;

  if (post.platform === "twitter") return <TwitterContent post={post} />;

  return null;
}
