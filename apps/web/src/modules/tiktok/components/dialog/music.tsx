import type { Post } from "@workspace/contracts/post";
import { MusicIcon } from "lucide-react";

export function RenderMusic({ post }: { post: Post }) {
  const music = post.metadata.platform === "tiktok" ? post.metadata.music : undefined;
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
