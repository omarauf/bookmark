import type { TiktokPost } from "@workspace/contracts/tiktok/post";
import { Iconify } from "@/components/iconify";

export function RenderMusic({ music }: { music: TiktokPost["music"] }) {
  if (!music) return null;

  return (
    <div className="flex items-start gap-2">
      <Iconify icon="solar:music-note-3-bold-duotone" />

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
