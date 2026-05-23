import { CreatorAvatar } from "@/modules/creator/avatar";
import { usePostContext } from "./context";

export function CreatorProfile() {
  const { creator } = usePostContext();

  return (
    <div className="flex items-center gap-3">
      <CreatorAvatar creator={creator} size="large" />
      {/* <div>
        <p className="font-medium text-base">{creator.name}</p>
        <a
          className="text-muted-foreground text-sm"
          href={`https://www.tiktok.com/@${creator.username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{creator.username}
        </a>
      </div> */}
    </div>
  );
}
