import type { PostMetadata } from "@workspace/contracts/post";
import { Eye, Heart, Play } from "lucide-react";
import { fShortenNumber } from "@/utils/format-number";
import { usePostContext } from "../utils/context";

export function Statistics() {
  const { metadata } = usePostContext();

  if (metadata.platform === "tiktok") return <TiktokStatistics metadata={metadata} />;

  if (metadata.platform === "instagram") return <InstagramStatistics metadata={metadata} />;

  return null;
}

function InstagramStatistics({ metadata }: { metadata: PostMetadata }) {
  if (metadata.platform !== "instagram") return null;

  return (
    <div className="flex justify-between">
      <IconNumber icon={Heart} number={metadata.likes} />

      {metadata.play && <IconNumber icon={Play} number={metadata.play} />}
      {metadata.view && <IconNumber icon={Eye} number={metadata.view} />}
    </div>
  );
}

function TiktokStatistics({ metadata }: { metadata: PostMetadata }) {
  if (metadata.platform !== "tiktok") return null;

  return (
    <div className="flex justify-between">
      <IconNumber icon={Heart} number={metadata.likes} />
    </div>
  );
}

function IconNumber({ icon: Icon, number }: { icon: React.ElementType; number: number }) {
  return (
    <div className="flex items-center gap-1">
      <Icon />
      <span>{fShortenNumber(number)}</span>
    </div>
  );
}
