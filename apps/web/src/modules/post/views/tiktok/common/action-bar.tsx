import { Bookmark, Forward, Heart, MessageCircle, Plus } from "lucide-react";
import { CreatorAvatar } from "@/modules/creator/avatar";
import { fShortenNumber } from "@/utils/format-number";
import { usePostContext } from "./context";
import { Music } from "./music";

type Props = {
  className?: string;
};

export function ActionBar({ className }: Props) {
  const post = usePostContext();

  if (post.platform !== "tiktok") return null;

  return (
    <div className={className}>
      {/* Creator avatar with follow button */}
      <div className="relative mb-1">
        <CreatorAvatar
          creator={post.creator}
          size="large"
          className="h-12 w-12 border-2 border-white"
        />
        <div className="absolute -bottom-1.5 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-red-500">
          <Plus className="h-3.5 w-3.5 text-white" strokeWidth={3} />
        </div>
      </div>

      <ActionButton icon={Heart} count={post.likes} label="likes" />
      <ActionButton icon={MessageCircle} count={post.comments} label="comments" />
      <ActionButton icon={Forward} count={post.shares} label="shares" />
      <ActionButton icon={Bookmark} count={post.collects} label="saves" />

      <Music />
    </div>
  );
}

function ActionButton({
  icon: Icon,
  count,
  label,
}: {
  icon: React.ElementType;
  count: number;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-0.5 text-white transition-transform hover:scale-110 active:scale-95"
      aria-label={label}
    >
      <Icon className="h-7 w-7" />
      <span className="font-medium text-xs">{fShortenNumber(count)}</span>
    </button>
  );
}
