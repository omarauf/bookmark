import type { PopulatedTiktokPost } from "@workspace/contracts/tiktok/post";
import { Iconify } from "@/components/iconify";
import { fShortenNumber } from "@/utils/format-number";

export function RenderStats({ post }: { post: PopulatedTiktokPost }) {
  return (
    <div className="flex justify-between">
      <IconNumber icon="twemoji:red-heart" number={post.likes} />
    </div>
  );
}

function IconNumber({ icon, number }: { icon: string; number: number }) {
  return (
    <div className="flex items-center gap-1">
      <Iconify icon={icon} />
      <span>{fShortenNumber(number)}</span>
    </div>
  );
}
