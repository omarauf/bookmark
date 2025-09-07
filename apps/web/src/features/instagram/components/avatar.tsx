import type { InstagramUser } from "@workspace/contracts/instagram/user";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";
import { staticFile } from "@/api/static-file";

type Props = {
  user: InstagramUser;
  size?: "small" | "large";
};

export function UserAvatar({ user, size }: Props) {
  return (
    <Avatar className={cn("border", size === "large" ? "h-10 w-10" : "h-8 w-8")}>
      <AvatarImage
        src={user.profilePicture && staticFile(user.profilePicture)}
        alt={user.username}
      />
      <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
