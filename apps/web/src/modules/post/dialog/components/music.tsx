import type { ItemMetadata } from "@workspace/contracts/item";
import { MusicIcon } from "lucide-react";
import { usePostContext } from "../utils/context";

export function Music() {
  const post = usePostContext();

  if (post.platform === "tiktok") return <TiktokMusic metadata={post} />;

  if (post.platform === "instagram") return <InstagramMusic metadata={post} />;

  return null;
}

function InstagramMusic({ metadata }: { metadata: ItemMetadata }) {
  if (metadata.platform !== "instagram" || metadata.kind !== "post") return null;

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

function TiktokMusic({ metadata }: { metadata: ItemMetadata }) {
  if (metadata.platform !== "tiktok" || metadata.kind !== "post") return null;

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
