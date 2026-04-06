import type { Profile } from "@workspace/contracts/profile";
import { staticFile } from "@/api/static-file";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  creator: Profile;
  size?: "small" | "large";
};

export function CreatorAvatar({ creator, size }: Props) {
  return (
    <Avatar className={cn("border", size === "large" ? "h-10 w-10" : "h-8 w-8")}>
      <AvatarImage src={staticFile(creator.avatar)} alt={creator.username} />
      <AvatarFallback>{creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
