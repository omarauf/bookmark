import { MusicIcon } from "lucide-react";
import { usePostContext } from "./context";

export function Music() {
  const post = usePostContext();

  if (post.platform !== "instagram" || !post.music) return null;

  return (
    <div className="flex items-start gap-2">
      <MusicIcon />

      <div>
        {post.music.original ? (
          <p className="text-sm">Original Audio</p>
        ) : (
          <p className="text-sm">
            {post.music.title} - {post.music.artist}
          </p>
        )}
      </div>
    </div>
  );
}
