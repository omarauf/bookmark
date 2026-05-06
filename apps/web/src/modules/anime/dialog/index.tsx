import type { AnimeItem } from "@workspace/contracts/views/anime";
import { Calendar, Clock, Layers, Star, Tv, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Props = {
  item: AnimeItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AnimeDetailsDialog({ item, open, onOpenChange }: Props) {
  const metadata = item.metadata;
  const rating = metadata.rating ?? 0;
  const ratingColor =
    rating >= 7 ? "text-emerald-500" : rating >= 5 ? "text-amber-500" : "text-rose-500";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-auto w-full flex-col gap-0 overflow-hidden border border-border/50 bg-background p-0 shadow-2xl sm:h-130 sm:w-180 sm:flex-row"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">{item.caption ?? item.externalId}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {item.caption ?? item.externalId}
        </DialogDescription>

        {/* Poster Column */}
        <div className="relative aspect-2/3 w-full shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:w-70">
          {metadata.poster ? (
            <img
              src={metadata.poster}
              alt={item.caption ?? item.externalId}
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
              {metadata.mediaType ?? "anime"}
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
          <div className="space-y-2 border-border/50 border-b p-5">
            <h2 className="font-semibold text-base text-foreground leading-snug">
              {item.caption ?? item.externalId}
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[10px] text-muted-foreground">
                {metadata.startSeasonYear ?? metadata.startDate?.slice(0, 4) ?? "—"}
              </span>
              {metadata.ratingLabel && (
                <span className="border border-border/50 px-1.5 py-0.5 text-[9px] text-muted-foreground uppercase">
                  {metadata.ratingLabel}
                </span>
              )}
              {metadata.numEpisodes && metadata.numEpisodes > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Layers className="h-3 w-3" />
                  {metadata.numEpisodes} eps
                </span>
              )}
              {metadata.averageEpisodeDuration && metadata.averageEpisodeDuration > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {Math.round(metadata.averageEpisodeDuration / 60)} min
                </span>
              )}
              {metadata.numScoringUsers && metadata.numScoringUsers > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {metadata.numScoringUsers.toLocaleString()} scores
                </span>
              )}
            </div>

            {metadata.genres && metadata.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {metadata.genres.map((g) => (
                  <span
                    key={g}
                    className="bg-muted px-2 py-0.5 text-[9px] text-muted-foreground uppercase tracking-wider"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Plot */}
          {metadata.synopsis && (
            <div className="p-5">
              <p className="text-[11px] text-foreground/80 leading-relaxed">{metadata.synopsis}</p>
            </div>
          )}

          <Separator className="bg-border/50" />

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            {/* Studios */}
            {metadata.studios && metadata.studios.length > 0 && (
              <MetadataRow
                icon={<Tv className="h-3 w-3" />}
                label="Studios"
                values={metadata.studios}
              />
            )}

            {/* Source */}
            {metadata.source && (
              <MetadataRow
                icon={<Layers className="h-3 w-3" />}
                label="Source"
                value={metadata.source}
              />
            )}

            {/* Status */}
            {metadata.status && (
              <MetadataRow
                icon={<Calendar className="h-3 w-3" />}
                label="Status"
                value={metadata.status}
              />
            )}

            {/* Start Date */}
            {metadata.startDate && (
              <MetadataRow
                icon={<Calendar className="h-3 w-3" />}
                label="Aired"
                value={`${metadata.startDate}${metadata.endDate ? ` — ${metadata.endDate}` : ""}`}
              />
            )}

            {/* Broadcast */}
            {metadata.broadcastDay && (
              <MetadataRow
                icon={<Clock className="h-3 w-3" />}
                label="Broadcast"
                value={`${metadata.broadcastDay}${metadata.broadcastTime ? ` at ${metadata.broadcastTime}` : ""}`}
              />
            )}

            {/* Season */}
            {metadata.startSeason && (
              <MetadataRow
                icon={<Calendar className="h-3 w-3" />}
                label="Season"
                value={`${metadata.startSeason} ${metadata.startSeasonYear ?? ""}`}
              />
            )}

            {/* Rank */}
            {metadata.rank && metadata.rank > 0 && (
              <MetadataRow
                icon={<Star className="h-3 w-3" />}
                label="Rank"
                value={`#${metadata.rank}`}
              />
            )}

            {/* Popularity */}
            {metadata.popularity && metadata.popularity > 0 && (
              <MetadataRow
                icon={<Users className="h-3 w-3" />}
                label="Popularity"
                value={`#${metadata.popularity}`}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */

function MetadataRow({
  icon,
  label,
  value,
  values,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  values?: string[];
  className?: string;
}) {
  const displayValues = values ?? (value ? [value] : []);
  if (displayValues.length === 0) return null;

  return (
    <div className={cn("border-border/30 border-b p-4 last:border-b-0", className)}>
      <div className="mb-1.5 flex items-center gap-1.5 text-muted-foreground/60">
        {icon}
        <span className="text-[9px] uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {displayValues.map((v) => (
          <span key={v} className="text-[11px] text-foreground/80">
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}
