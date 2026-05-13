import type { Post } from "@workspace/contracts/views/post";
import { InstagramIcon } from "@/assets/icons";
import { Caption } from "./caption";
import { PostContext } from "./context";
import { CreatorProfile } from "./creator-profile";
import { Location } from "./location";
import { Media } from "./media";
import { Music } from "./music";
import { Statistics } from "./stats";

type Props = {
  post: Post;
};

export function InstagramContent({ post }: Props) {
  return (
    <PostContext.Provider value={post}>
      <div className="flex w-fit">
        <Media className="h-full w-full object-cover" />
      </div>

      <div className="w-125">
        <div className="flex h-full flex-col gap-4">
          <div className="relative flex items-center justify-between">
            <CreatorProfile />

            <div className="absolute top-0 right-0">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          <Statistics />

          <Caption />

          <Location />

          <Music />
        </div>
      </div>
    </PostContext.Provider>
  );
}
