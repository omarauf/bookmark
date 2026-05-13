import type { Post } from "@workspace/contracts/views/post";
import { PostItem } from "../views/item";

type Props = {
  posts?: Post[];
};

export function PostListFeed({ posts = [] }: Props) {
  const flatItems = posts;

  return (
    <div className="mx-auto grid max-w-xl grid-cols-1 gap-4">
      {flatItems?.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
