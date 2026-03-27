import type { Creator } from "@workspace/contracts/creator";
import { staticFile } from "@/api/static-file";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  creator: Creator;
  size?: "small" | "large";
};

export function UserAvatar({ creator, size }: Props) {
  return (
    <Avatar className={cn("border", size === "large" ? "h-10 w-10" : "h-8 w-8")}>
      <AvatarImage src={creator.avatar && staticFile(creator.avatar)} alt={creator.username} />
      <AvatarFallback>{creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
