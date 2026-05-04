import type { ImdbItem } from "@workspace/contracts/imdb-view";
import {
  Calendar,
  Clapperboard,
  Clock,
  DollarSign,
  Film,
  Layers,
  MonitorPlay,
  Star,
  Users,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
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
        className="flex h-auto w-full flex-col gap-0 overflow-hidden rounded-none border border-border/50 bg-background p-0 shadow-2xl sm:max-w-6xl sm:flex-row"
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
              <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest">
                No Poster
              </span>
            </div>
          )}

          {/* Kind Badge */}
          <div className="absolute top-3 left-3 bg-background/90 px-2 py-1 backdrop-blur-sm">
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
              {metadata.kind}
            </span>
          </div>

          {/* Rating Badge */}
          {rating > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 px-2 py-1 backdrop-blur-sm">
              <Star className={cn("h-3 w-3", ratingColor)} />
              <span className={cn("font-mono font-semibold text-[11px]", ratingColor)}>
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Header */}
          <div className="space-y-2 border-border/50 border-b p-5">
            <h2 className="font-mono font-semibold text-base text-foreground leading-snug">
              {item.caption ?? item.externalId}
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[10px] text-muted-foreground">
                {metadata.year ?? "—"}
              </span>
              {isMovie && "rated" in metadata && metadata.rated && metadata.rated !== "N/A" && (
                <span className="border border-border/50 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground uppercase">
                  {metadata.rated}
                </span>
              )}
              {metadata.runtime > 0 && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {metadata.runtime} min
                </span>
              )}
              {metadata.votes > 0 && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {metadata.votes.toLocaleString()} votes
                </span>
              )}
            </div>

            {metadata.genre && metadata.genre.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {metadata.genre.map((g) => (
                  <span
                    key={g}
                    className="bg-muted px-2 py-0.5 font-mono text-[9px] text-muted-foreground uppercase tracking-wider"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Plot */}
          {metadata.plot && metadata.plot !== "N/A" && (
            <div className="p-5">
              <p className="font-mono text-[11px] text-foreground/80 leading-relaxed">
                {metadata.plot}
              </p>
            </div>
          )}

          <Separator className="bg-border/50" />

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            {/* Directors */}
            {metadata.directors && metadata.directors.length > 0 && (
              <MetadataRow
                icon={<Clapperboard className="h-3 w-3" />}
                label="Directors"
                values={metadata.directors}
              />
            )}

            {/* Writers */}
            {metadata.writers && metadata.writers.length > 0 && (
              <MetadataRow
                icon={<Layers className="h-3 w-3" />}
                label="Writers"
                values={metadata.writers}
              />
            )}

            {/* Actors */}
            {metadata.actors && metadata.actors.length > 0 && (
              <MetadataRow
                icon={<Users className="h-3 w-3" />}
                label="Cast"
                values={metadata.actors}
                className="sm:col-span-2"
              />
            )}

            {/* Released */}
            {metadata.released && metadata.released !== "N/A" && (
              <MetadataRow
                icon={<Calendar className="h-3 w-3" />}
                label="Released"
                value={metadata.released}
              />
            )}

            {/* Box Office (Movie only) */}
            {isMovie && "boxOffice" in metadata && metadata.boxOffice && (
              <MetadataRow
                icon={<DollarSign className="h-3 w-3" />}
                label="Box Office"
                value={`$${metadata.boxOffice.toLocaleString()}`}
              />
            )}

            {/* Seasons (TV only) */}
            {!isMovie && "seasons" in metadata && metadata.seasons > 0 && (
              <MetadataRow
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
        <span className="font-mono text-[9px] uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {displayValues.map((v) => (
          <span key={v} className="font-mono text-[11px] text-foreground/80">
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}
