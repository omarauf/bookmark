import type { Post } from "@workspace/contracts/views/post";
import { TiktokIcon } from "@/assets/icons";
import { ActionBar } from "./common/action-bar";
import { BottomOverlay } from "./common/bottom-overlay";
import { PostContext } from "./common/context";
import { Media } from "./common/media";

type Props = {
  post: Post;
};

export function TiktokItem({ post }: Props) {
  return (
    <PostContext.Provider value={post}>
      <div className="pointer-events-auto relative flex h-full items-center justify-center">
        <Media className="min-h-200 bg-black object-contain" />

        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-20 text-white opacity-80 transition-opacity hover:opacity-100"
        >
          <TiktokIcon className="h-6 w-6" />
        </a>

        <ActionBar className="absolute right-0 bottom-0 z-20 flex flex-col items-center gap-5 px-4 py-2" />

        <BottomOverlay className="" captionClassName="pr-10" />
      </div>
    </PostContext.Provider>
  );
}
