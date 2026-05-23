import { MusicIcon } from "lucide-react";
import { usePostContext } from "./context";

export function Music() {
  const post = usePostContext();

  if (post.platform !== "tiktok" || !post.music) return null;

  // const musicText = post.music.original
  //   ? "Original Audio"
  //   : `${post.music.title} - ${post.music.authorName}`;

  return (
    <div className="flex items-center gap-2">
      {/* <div className="flex-1 overflow-hidden">
        <p className="truncate font-medium text-sm">{musicText}</p>
      </div> */}
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-black/20">
        <MusicIcon className="h-5 w-5 text-white" />
      </div>
    </div>
  );
}
