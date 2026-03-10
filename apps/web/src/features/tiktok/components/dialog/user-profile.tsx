import type { TiktokUser } from "@workspace/contracts/tiktok/user";
import { DialogTitle } from "@workspace/ui/components/dialog";
import { UserAvatar } from "../avatar";

export function UserProfile({ creator }: { creator: TiktokUser }) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar user={creator} size="large" />
      <div>
        <DialogTitle className="font-medium text-base">{creator.name}</DialogTitle>
        <a
          className="text-muted-foreground text-sm"
          href={`https://www.tiktok.com/@${creator.username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{creator.username}
        </a>
      </div>
    </div>
  );
}
