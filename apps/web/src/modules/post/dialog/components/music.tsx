import type { PostMetadata } from "@workspace/contracts/post";
import { MusicIcon } from "lucide-react";
import { usePostContext } from "../utils/context";

export function Music() {
  const { metadata } = usePostContext();

  if (metadata.platform === "tiktok") return <TiktokMusic metadata={metadata} />;

  if (metadata.platform === "instagram") return <InstagramMusic metadata={metadata} />;

  return null;
}

function InstagramMusic({ metadata }: { metadata: PostMetadata }) {
  if (metadata.platform !== "instagram") return null;

  const { music } = metadata;
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

function TiktokMusic({ metadata }: { metadata: PostMetadata }) {
  if (metadata.platform !== "tiktok") return null;

  const { music } = metadata;
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
