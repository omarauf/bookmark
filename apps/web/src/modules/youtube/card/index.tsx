import type { YoutubeItem } from "@workspace/contracts/views/youtube";
import { Card } from "@/components/ui/card";

type Props = {
  item: YoutubeItem;
};

export function YoutubeCard({ item }: Props) {
  const metadata = item.metadata;

  return (
    <Card className="group cursor-pointer gap-1 overflow-hidden border-border/50 bg-transparent p-0 shadow-none transition-colors hover:border-foreground/30">
      {/* Poster */}
      <div className="relative aspect-2/3 overflow-hidden bg-muted">
        <img
          src={metadata.thumbnail}
          alt={item.caption ?? item.externalId}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Kind Badge */}
        {/* <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-background/90 px-1.5 py-0.5 text-muted-foreground backdrop-blur-sm">
          <span className={cn("text-[9px]")}>{metadata.mediaType ?? "anime"}</span>
        </div> */}

        {/* Rating Badge */}
        {/* {rating > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-background/90 px-1.5 py-0.5 backdrop-blur-sm">
            <Star className={cn("mr-0.5 h-2 w-2", ratingColor)} />
            <span className={cn("text-[9px]", ratingColor)}>{rating.toFixed(1)}</span>
          </div>
        )} */}
      </div>

      {/* Info */}
      <div className="space-y-1 p-2">
        <h3 className="line-clamp-2 text-nowrap font-medium text-foreground text-xs leading-tight">
          {item.caption ?? item.externalId}
        </h3>

        {/* <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">
            {metadata.startSeasonYear ?? metadata.startDate?.slice(0, 4) ?? "—"}
          </span>
          {metadata.genres && metadata.genres.length > 0 && (
            <span className="truncate text-[9px] text-muted-foreground/60 uppercase tracking-wider">
              {metadata.genres[0]}
            </span>
          )}
        </div> */}
      </div>
    </Card>
  );
}
