import { Pin } from "lucide-react";
import { usePostContext } from "./context";

export function Location() {
  const post = usePostContext();

  const location = post.platform === "instagram" ? post.location : undefined;
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
