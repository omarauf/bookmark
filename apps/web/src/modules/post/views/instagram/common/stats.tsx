import { Eye, Heart, Play } from "lucide-react";
import { fShortenNumber } from "@/utils/format-number";
import { usePostContext } from "./context";

export function Statistics() {
  const post = usePostContext();

  if (post.platform !== "instagram") return null;

  return (
    <div className="flex justify-between">
      <IconNumber icon={Heart} number={post.likes} />

      {post.play && <IconNumber icon={Play} number={post.play} />}
      {post.view && <IconNumber icon={Eye} number={post.view} />}
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
