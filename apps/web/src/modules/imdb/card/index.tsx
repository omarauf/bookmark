import { useSearch } from "@tanstack/react-router";
import type { ImdbItem } from "@workspace/contracts/views/imdb";
import { Film, MonitorPlay, Star } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ImdbDetailsDialog } from "../dialogs/details";
import { ImdbUpdateDialog } from "../dialogs/update";

type Props = {
  imdb: ImdbItem;
};

export function ImdbCard({ imdb }: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const updateMode = useSearch({
    from: "/_authenticated/imdb/",
    select: (s) => s.mode === "update",
  });

  const rating = imdb.rating ?? 0;
  const ratingColor =
    rating >= 7 ? "text-emerald-500" : rating >= 5 ? "text-amber-500" : "text-rose-500";

  const handleClick = () => {
    if (updateMode) {
      setUpdateOpen(true);
    } else {
      setDetailsOpen(true);
    }
  };

  return (
    <>
      <Card
        className="group cursor-pointer gap-1 overflow-hidden border-border/50 bg-transparent p-0 shadow-none transition-colors hover:border-foreground/30"
        onClick={handleClick}
      >
        {/* Poster */}
        <div className="relative aspect-2/3 overflow-hidden bg-muted">
          {imdb.poster && imdb.poster !== "N/A" ? (
            <img
              src={imdb.poster}
              alt={imdb.caption ?? imdb.externalId}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {imdb.kind === "movie" ? (
                <Film className="h-8 w-8 text-muted-foreground/30" />
              ) : (
                <MonitorPlay className="h-8 w-8 text-muted-foreground/30" />
              )}
            </div>
          )}

          {/* Kind Badge */}
          <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-background/90 px-1.5 py-0.5 text-muted-foreground backdrop-blur-sm">
            <span className={cn("text-[9px]")}> {imdb.kind}</span>
          </div>

          {/* Rating Badge */}
          {rating > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-background/90 px-1.5 py-0.5 backdrop-blur-sm">
              <Star className={cn("mr-0.5 h-2 w-2", ratingColor)} />
              <span className={cn("text-[9px]", ratingColor)}>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1 p-2">
          <h3 className="line-clamp-2 text-nowrap font-medium text-foreground text-xs leading-tight">
            {imdb.caption ?? imdb.externalId}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">{imdb.year ?? "—"}</span>
            {imdb.genres && imdb.genres.length > 0 && (
              <span className="truncate text-[9px] text-muted-foreground/60 uppercase tracking-wider">
                {imdb.genres[0]}
              </span>
            )}
          </div>
        </div>
      </Card>

      <ImdbDetailsDialog imdb={imdb} open={detailsOpen} onOpenChange={setDetailsOpen} />
      <ImdbUpdateDialog item={imdb} open={updateOpen} onOpenChange={setUpdateOpen} />
    </>
  );
}
