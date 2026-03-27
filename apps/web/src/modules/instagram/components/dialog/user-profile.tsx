import type { Creator } from "@workspace/contracts/creator";
import { DialogTitle } from "@/components/ui/dialog";
import { UserAvatar } from "../avatar";

export function UserProfile({ creator }: { creator: Creator }) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar creator={creator} size="large" />
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
