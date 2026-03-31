import { MusicIcon } from "lucide-react";
import { usePostContext } from "../utils/context";

export function Music() {
  const { metadata } = usePostContext();
  const music = metadata.platform === "instagram" ? metadata.music : undefined;
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
