import { Link } from "@tanstack/react-router";
import type { ImdbItem } from "@workspace/contracts/views/imdb";
import {
  Calendar,
  Clapperboard,
  Clock,
  DollarSign,
  ExternalLink,
  Film,
  Layers,
  MonitorPlay,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { KeyValue } from "@/components/ui/key-value";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Props = {
  item: ImdbItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ImdbDetailsDialog({ item, open, onOpenChange }: Props) {
  const metadata = item.metadata;
  const rating = metadata.rating ?? 0;
  const ratingColor =
    rating >= 7 ? "text-emerald-500" : rating >= 5 ? "text-amber-500" : "text-rose-500";

  const isMovie = metadata.kind === "movie";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-auto w-full flex-col gap-0 overflow-hidden border border-border/50 bg-background p-0 shadow-2xl sm:max-w-6xl sm:flex-row"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">{item.caption ?? item.externalId}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {item.caption ?? item.externalId}
        </DialogDescription>

        {/* Poster Column */}
        <div className="relative aspect-2/3 h-fit w-3/5 shrink-0 overflow-hidden bg-muted">
          {metadata.poster && metadata.poster !== "N/A" ? (
            <img
              src={metadata.poster}
              alt={item.caption ?? item.externalId}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              {isMovie ? (
                <Film className="h-16 w-16 text-muted-foreground/20" />
              ) : (
                <MonitorPlay className="h-16 w-16 text-muted-foreground/20" />
              )}
              <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
                No Poster
              </span>
            </div>
          )}

          {/* Kind Badge */}
          <div className="absolute top-3 left-3 bg-background/90 px-2 py-1 backdrop-blur-sm">
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
              {metadata.kind}
            </span>
          </div>

          {/* Rating Badge */}
          {rating > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 px-2 py-1 backdrop-blur-sm">
              <Star className={cn("h-3 w-3", ratingColor)} />
              <span className={cn("font-semibold text-[11px]", ratingColor)}>
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Header */}
          <div className="space-y-2 border-border/50 border-b p-5 pr-10">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-base text-foreground leading-snug">
                {item.caption ?? item.externalId}
              </h2>

              <Button asChild variant="outline" size="xs" className="text-[10px]">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                  IMDb
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[10px] text-muted-foreground">{metadata.year ?? "—"}</span>
              {isMovie && "rated" in metadata && metadata.rated && metadata.rated !== "N/A" && (
                <span className="border border-border/50 px-1.5 py-0.5 text-[9px] text-muted-foreground uppercase">
                  {metadata.rated}
                </span>
              )}
              {metadata.runtime > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {metadata.runtime} min
                </span>
              )}
              {metadata.votes > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {metadata.votes.toLocaleString()} votes
                </span>
              )}
            </div>

            {metadata.genres && metadata.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {metadata.genres.map((g) => (
                  <Badge
                    key={g}
                    size="sm"
                    variant="secondary"
                    className="text-muted-foreground uppercase"
                    asChild
                  >
                    <Link to="/imdb" search={{ genre: g }} onClick={() => onOpenChange(false)}>
                      {g}
                    </Link>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Plot */}
          {metadata.plot && metadata.plot !== "N/A" && (
            <div className="p-5">
              <p className="text-[11px] text-foreground/80 leading-relaxed">{metadata.plot}</p>
            </div>
          )}

          <Separator className="bg-border/50" />

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            {/* Directors */}
            {metadata.directors && metadata.directors.length > 0 && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<Clapperboard className="h-3 w-3" />}
                label="Directors"
                values={metadata.directors}
              />
            )}

            {/* Writers */}
            {metadata.writers && metadata.writers.length > 0 && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<Layers className="h-3 w-3" />}
                label="Writers"
                values={metadata.writers}
              />
            )}

            {/* Actors */}
            {metadata.actors && metadata.actors.length > 0 && (
              <KeyValue
                className="border-border/30 border-b sm:col-span-2"
                icon={<Users className="h-3 w-3" />}
                label="Cast"
                values={metadata.actors}
              />
            )}

            {/* Released */}
            {metadata.released && metadata.released !== "N/A" && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<Calendar className="h-3 w-3" />}
                label="Released"
                value={metadata.released}
              />
            )}

            {/* Box Office (Movie only) */}
            {isMovie && "boxOffice" in metadata && metadata.boxOffice && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<DollarSign className="h-3 w-3" />}
                label="Box Office"
                value={`$${metadata.boxOffice.toLocaleString()}`}
              />
            )}

            {/* Seasons (TV only) */}
            {!isMovie && "seasons" in metadata && metadata.seasons > 0 && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<Layers className="h-3 w-3" />}
                label="Seasons"
                value={String(metadata.seasons)}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
