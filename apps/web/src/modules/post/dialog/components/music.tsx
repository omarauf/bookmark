import type { Post } from "@workspace/contracts/views/post";
import { MusicIcon } from "lucide-react";
import { usePostContext } from "../utils/context";

export function Music() {
  const post = usePostContext();

  if (post.platform === "tiktok") return <TiktokMusic post={post} />;

  if (post.platform === "instagram") return <InstagramMusic post={post} />;

  return null;
}

function InstagramMusic({ post }: { post: Post }) {
  if (post.platform !== "instagram") return null;

  const { music } = post;
  if (!music) return null;

  return (
    <div className="flex items-start gap-2">
      <MusicIcon />

      <div>
        {music.original ? (
          <p className="text-sm">Original Audio</p>
        ) : (
          <p className="text-sm">
            {music.title} - {music.artist}
          </p>
        )}
      </div>
    </div>
  );
}

function TiktokMusic({ post }: { post: Post }) {
  if (post.platform !== "tiktok") return null;

  const { music } = post;
  if (!music) return null;

  return (
    <div className="flex items-start gap-2">
      <MusicIcon />

      <div>
        {music.original ? (
          <p className="text-sm">Original Audio</p>
        ) : (
          <p className="text-sm">
            {music.title} - {music.authorName}
          </p>
        )}
      </div>
    </div>
  );
}
