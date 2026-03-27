import type { Post } from "@workspace/contracts/post";
import { Pin } from "lucide-react";

export function RenderLocation({ post }: { post: Post }) {
  const location = post.metadata.platform === "instagram" ? post.metadata.location : undefined;
  if (!location) return null;

  return (
    <div className="flex items-center gap-2">
      <Pin className="h-4 w-4" />
      <div>
        <p className="font-medium text-sm">{location.name}</p>
        <p className="text-muted-foreground text-xs">
          {location.city && location.address
            ? `${location.city}, ${location.address}`
            : location.city || location.address}
        </p>
      </div>
    </div>
  );
}
