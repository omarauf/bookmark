import type { InstagramPost } from "@workspace/contracts/instagram/post";
import { Iconify } from "@/components/iconify";

export function RenderLocation({ location }: { location: InstagramPost["location"] }) {
  if (!location) return null;

  return (
    <div className="flex items-center gap-2">
      <Iconify icon="solar:map-point-bold" width={24} />
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
