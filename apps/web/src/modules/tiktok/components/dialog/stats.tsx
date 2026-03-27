import type { Post } from "@workspace/contracts/post";
import { Heart } from "lucide-react";
import { fShortenNumber } from "@/utils/format-number";

export function RenderStats({ post }: { post: Post }) {
  const metadata = post.metadata.platform === "tiktok" ? post.metadata : undefined;

  if (!metadata) return null;

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
