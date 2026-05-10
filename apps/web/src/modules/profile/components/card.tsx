import { Link } from "@tanstack/react-router";
import type { Profile } from "@workspace/contracts/views/profile";
import { ImageIcon, MessageSquare, User } from "lucide-react";
import { staticFile } from "@/api/static-file";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { platformStyles } from "../badges/platform";

type Props = {
  profile: Profile;
};

export function ProfileCard({ profile }: Props) {
  const style = platformStyles[profile.platform];

  return (
    <Link to="/profiles/$id" params={{ id: profile.id }}>
      <Card className="group relative flex h-full flex-col items-center gap-4 overflow-hidden border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className={cn("font-semibold text-[10px]", style.badge)}>
            {style.label}
          </Badge>
        </div>

        <div className="relative">
          <Avatar className="h-20 w-20 ring-2 ring-border ring-offset-2 ring-offset-background transition-transform duration-300 group-hover:scale-105">
            <AvatarImage src={staticFile(profile.avatar)} alt={profile.username} />
            <AvatarFallback className="text-lg">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex grow flex-col items-center gap-1 text-center">
          <h3 className="max-w-50 truncate font-semibold text-base">{profile.name}</h3>
          <p className="text-muted-foreground text-sm">@{profile.username}</p>
        </div>

        <div className="flex w-full items-center justify-center gap-6 border-t pt-4">
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <ImageIcon className="h-3 w-3" />
              <span>Posts</span>
            </div>
            <span className="font-semibold text-sm">{profile.postCount ?? 0}</span>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <MessageSquare className="h-3 w-3" />
              <span>Tags</span>
            </div>
            <span className="font-semibold text-sm">{profile.tagCount ?? 0}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
