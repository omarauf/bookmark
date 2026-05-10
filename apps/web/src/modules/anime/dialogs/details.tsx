import { Link } from "@tanstack/react-router";
import type { Anime } from "@workspace/contracts/views/anime";
import { Calendar, Clock, ExternalLink, Layers, Star, Tv, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { KeyValue } from "@/components/ui/key-value";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Props = {
  anime: Anime;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AnimeDetailsDialog({ anime, open, onOpenChange }: Props) {
  const rating = anime.rating ?? 0;
  const ratingColor =
    rating >= 7 ? "text-emerald-500" : rating >= 5 ? "text-amber-500" : "text-rose-500";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-auto w-full flex-col gap-0 overflow-hidden border border-border/50 bg-background p-0 shadow-2xl sm:max-w-6xl sm:flex-row"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">{anime.caption ?? anime.externalId}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {anime.caption ?? anime.externalId}
        </DialogDescription>

        {/* Poster Column */}
        <div className="relative aspect-2/3 h-fit w-3/5 shrink-0 overflow-hidden bg-muted">
          {anime.poster ? (
            <img
              src={anime.poster}
              alt={anime.caption ?? anime.externalId}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              <Tv className="h-16 w-16 text-muted-foreground/20" />
              <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
                No Poster
              </span>
            </div>
          )}

          {/* Kind Badge */}
          <div className="absolute top-3 left-3 bg-background/90 px-2 py-1 backdrop-blur-sm">
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
              {anime.mediaType ?? "anime"}
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
                {anime.caption ?? anime.externalId}
              </h2>

              <Button asChild variant="outline" size="xs" className="text-[10px]">
                <a href={anime.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                  MAL
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[10px] text-muted-foreground">
                {anime.startSeasonYear ?? anime.startDate?.slice(0, 4) ?? "—"}
              </span>
              {anime.ratingLabel && (
                <span className="border border-border/50 px-1.5 py-0.5 text-[9px] text-muted-foreground uppercase">
                  {anime.ratingLabel}
                </span>
              )}
              {anime.numEpisodes && anime.numEpisodes > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Layers className="h-3 w-3" />
                  {anime.numEpisodes} eps
                </span>
              )}
              {anime.averageEpisodeDuration && anime.averageEpisodeDuration > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {Math.round(anime.averageEpisodeDuration / 60)} min
                </span>
              )}
              {anime.numScoringUsers && anime.numScoringUsers > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {anime.numScoringUsers.toLocaleString()} scores
                </span>
              )}
            </div>

            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {anime.genres.map((g) => (
                  <Badge
                    key={g}
                    size="sm"
                    variant="secondary"
                    className="text-muted-foreground uppercase"
                    asChild
                  >
                    <Link to="/anime" search={{ genre: g }} onClick={() => onOpenChange(false)}>
                      {g}
                    </Link>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Plot */}
          {anime.synopsis && (
            <div className="p-5">
              <p className="text-[11px] text-foreground/80 leading-relaxed">{anime.synopsis}</p>
            </div>
          )}

          <Separator className="bg-border/50" />

          {/* Anime Grid */}
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            {/* Studios */}
            {anime.studios && anime.studios.length > 0 && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<Tv className="h-3 w-3" />}
                label="Studios"
                values={anime.studios}
              />
            )}

            {/* Source */}
            {anime.source && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<Layers className="h-3 w-3" />}
                label="Source"
                value={anime.source}
              />
            )}

            {/* Status */}
            {anime.status && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<Calendar className="h-3 w-3" />}
                label="Status"
                value={anime.status}
              />
            )}

            {/* Start Date */}
            {anime.startDate && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<Calendar className="h-3 w-3" />}
                label="Aired"
                value={`${anime.startDate}${anime.endDate ? ` — ${anime.endDate}` : ""}`}
              />
            )}

            {/* Broadcast */}
            {anime.broadcastDay && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<Clock className="h-3 w-3" />}
                label="Broadcast"
                value={`${anime.broadcastDay}${anime.broadcastTime ? ` at ${anime.broadcastTime}` : ""}`}
              />
            )}

            {/* Season */}
            {anime.startSeason && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<Calendar className="h-3 w-3" />}
                label="Season"
                value={`${anime.startSeason} ${anime.startSeasonYear ?? ""}`}
              />
            )}

            {/* Rank */}
            {anime.rank && anime.rank > 0 && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<Star className="h-3 w-3" />}
                label="Rank"
                value={`#${anime.rank}`}
              />
            )}

            {/* Popularity */}
            {anime.popularity && anime.popularity > 0 && (
              <KeyValue
                className="border-border/30 border-b"
                icon={<Users className="h-3 w-3" />}
                label="Popularity"
                value={`#${anime.popularity}`}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
