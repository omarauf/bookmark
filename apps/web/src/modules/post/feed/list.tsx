import type { Post } from "@workspace/contracts/views/post";
import { PostContent } from "../content";

type Props = {
  posts?: Post[];
};

export function PostListFeed({ posts = [] }: Props) {
  const flatItems = posts;

  return (
    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4">
      {flatItems?.map((post) => (
        <div
          key={post.id}
          className="flex flex-col gap-6 rounded-xl border bg-card p-4 text-card-foreground shadow-sm"
        >
          <PostContent post={post} />
        </div>
      ))}
    </div>
  );
}
