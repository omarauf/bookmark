import type { Post } from "@workspace/contracts/post";
import { Music } from "lucide-react";

export function RenderMusic({ post }: { post: Post }) {
  const music = post.metadata.platform === "instagram" ? post.metadata.music : undefined;
  if (!music) return null;

  return (
    <div className="flex items-start gap-2">
      <Music />

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
