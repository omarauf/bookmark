import { Bookmark, Forward, Heart, MessageCircle, Play } from "lucide-react";
import { fShortenNumber } from "@/utils/format-number";
import { usePostContext } from "./context";

export function Statistics() {
  const post = usePostContext();

  if (post.platform !== "tiktok") return null;

  return (
    <div className="flex justify-between">
      <IconNumber icon={Play} number={post.plays} />
      <IconNumber icon={Heart} number={post.likes} />
      <IconNumber icon={MessageCircle} number={post.comments} />
      <IconNumber icon={Forward} number={post.shares} />
      <IconNumber icon={Bookmark} number={post.collects} />
    </div>
  );
}

function IconNumber({ icon: Icon, number }: { icon: React.ElementType; number: number }) {
  return (
    <div className="flex items-center gap-1">
      <Icon className="h-4 w-4" />
      <span>{fShortenNumber(number)}</span>
    </div>
  );
}
