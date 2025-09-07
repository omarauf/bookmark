import type { PopulatedInstagramPost } from "@workspace/contracts/instagram/post";
import { Iconify } from "@/components/iconify";
import { fShortenNumber } from "@/utils/format-number";

export function RenderStats({ post }: { post: PopulatedInstagramPost }) {
  return (
    <div className="flex justify-between">
      <IconNumber icon="twemoji:red-heart" number={post.likes} />

      {post.media.mediaType === "video" && (
        <>
          <IconNumber icon="solar:play-bold" number={post.media.playCount} />
          <IconNumber icon="solar:eye-bold-duotone" number={post.media.viewCount} />
        </>
      )}
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
