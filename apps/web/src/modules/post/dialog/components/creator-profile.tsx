import { DialogTitle } from "@/components/ui/dialog";
import { CreatorAvatar } from "@/modules/creator/avatar";
import { usePostContext } from "../utils/context";

export function CreatorProfile() {
  const { creator } = usePostContext();

  return (
    <div className="flex items-center gap-3">
      <CreatorAvatar creator={creator} size="large" />
      <div>
        <DialogTitle className="font-medium text-base">{creator.name}</DialogTitle>
        <a
          className="text-muted-foreground text-sm"
          href={`https://www.instagram.com/${creator.username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{creator.username}
        </a>
      </div>
    </div>
  );
}
