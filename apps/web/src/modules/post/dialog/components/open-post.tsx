import type { Platform } from "@workspace/contracts/platform";
import { TikTokIcon, TwitterIcon } from "@/assets/icons";
import { InstagramIcon } from "@/assets/icons/instagram";
import { Button } from "@/components/ui/button";
import { usePostContext } from "../utils/context";

export function OpenPost() {
  const { url, platform } = usePostContext();

  const icon = getIcon(platform);

  if (!icon) return null;

  return (
    <Button variant="ghost" size="icon-lg" asChild>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {icon}
      </a>
    </Button>
  );
}

function getIcon(platform: Platform) {
  switch (platform) {
    case "instagram":
      return <InstagramIcon className="size-6" />;
    case "twitter":
      return <TwitterIcon className="size-6" />;
    case "tiktok":
      return <TikTokIcon className="size-6" />;
    default:
      return null;
  }
}
