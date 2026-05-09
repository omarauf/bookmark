import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ItemSchemas, type UpdateItem } from "@workspace/contracts/item";
import type { ImdbItem } from "@workspace/contracts/views/imdb";
import { Film, Heart, MonitorPlay, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { orpc } from "@/integrations/orpc";
import { cn } from "@/lib/utils";
import { getError } from "@/utils/error";

type Props = {
  item: ImdbItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/* ------------------------------------------------------------------ */
/*  Star Rating                                                       */
/* ------------------------------------------------------------------ */

function StarRating({
  value,
  onChange,
  max = 10,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hover || value);
        return (
          <button
            key={i}
            type="button"
            className="relative h-5 w-5 transition-all duration-150 hover:scale-110 focus:outline-none"
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(starValue)}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors duration-150",
                isFilled
                  ? "fill-amber-500 text-amber-500"
                  : "fill-transparent text-muted-foreground/20",
              )}
            />
          </button>
        );
      })}
      <span className="ml-2 font-medium text-amber-500 text-xs tabular-nums">
        {value > 0 ? value.toFixed(1) : "—"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Divider                                                   */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px flex-1 bg-gradient-to-r from-amber-500/20 to-transparent" />
      <span className="text-[9px] text-muted-foreground/60 uppercase tracking-[0.2em]">
        {children}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-amber-500/20 to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dialog                                                            */
/* ------------------------------------------------------------------ */

export function ImdbUpdateDialog({ item, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const metadata = item.metadata;
  const isMovie = metadata.kind === "movie";

  const tagsQuery = useQuery(orpc.tag.options.queryOptions());
  const collectionsQuery = useQuery(orpc.collection.options.queryOptions());
  const updateMutation = useMutation(orpc.item.update.mutationOptions());

  const form = useAppForm({
    defaultValues: {
      id: item.id,
      note: item.note ?? "",
      rate: item.rate ?? 0,
      favorite: item.favorite ?? false,
      tagIds: item.tagIds ?? [],
      collectionIds: item.collectionIds ?? [],
    } as UpdateItem,
    validators: { onSubmit: ItemSchemas.update.request },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync(value);
        queryClient.invalidateQueries({ queryKey: orpc.imdb.list.key() });
        toast.success("Item updated successfully");
        onOpenChange(false);
      } catch (error) {
        const msg = getError(error, "Failed to update item");
        toast.error(msg);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-auto w-full flex-col gap-0 overflow-hidden border-amber-500/15 bg-background p-0 shadow-2xl sm:h-[680px] sm:w-[440px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Update {item.caption ?? item.externalId}</DialogTitle>
        <DialogDescription className="sr-only">
          Update your review and organization for {item.caption ?? item.externalId}
        </DialogDescription>

        {/* ── Cinematic Header Strip ── */}
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-background to-amber-500/[0.04]">
          {/* Amber top hairline */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          <div className="flex items-start gap-4 p-5 pr-12">
            {/* Poster */}
            <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-sm bg-muted shadow-lg ring-1 ring-amber-500/10">
              {metadata.poster && metadata.poster !== "N/A" ? (
                <img
                  src={metadata.poster}
                  alt={item.caption ?? item.externalId}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  {isMovie ? (
                    <Film className="h-6 w-6 text-muted-foreground/20" />
                  ) : (
                    <MonitorPlay className="h-6 w-6 text-muted-foreground/20" />
                  )}
                </div>
              )}
              <div className="absolute top-1 left-1 bg-background/90 px-1 py-0.5 backdrop-blur-sm">
                <span className="text-[8px] text-muted-foreground uppercase tracking-wider">
                  {metadata.kind}
                </span>
              </div>
            </div>

            {/* Title block */}
            <div className="flex flex-1 flex-col gap-1 pt-0.5">
              <h2 className="font-semibold text-foreground text-sm leading-snug">
                {item.caption ?? item.externalId}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{metadata.year ?? "—"}</span>
                {isMovie && "rated" in metadata && metadata.rated && metadata.rated !== "N/A" && (
                  <span className="border border-border/50 px-1 py-0.5 text-[9px] text-muted-foreground uppercase">
                    {metadata.rated}
                  </span>
                )}
              </div>
              {metadata.genres && metadata.genres.length > 0 && (
                <span className="truncate text-[9px] text-muted-foreground/50 uppercase tracking-wider">
                  {metadata.genres.slice(0, 3).join(" · ")}
                </span>
              )}
            </div>
          </div>

          {/* Custom close */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* ── Scrollable Form ── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <ScrollArea className="flex-1">
            <div className="space-y-6 p-6">
              {/* ── Your Review ── */}
              <div className="space-y-4">
                <SectionLabel>Your Review</SectionLabel>

                <div className="flex items-center justify-between gap-4">
                  {/* Rating */}
                  <form.AppField name="rate">
                    {(field) => (
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest">
                          Rating
                        </span>
                        <StarRating
                          value={Number(field.state.value) || 0}
                          onChange={field.handleChange}
                        />
                      </div>
                    )}
                  </form.AppField>

                  {/* Favorite */}
                  <form.AppField name="favorite">
                    {(field) => {
                      const isFav = field.state.value;
                      return (
                        <div className="space-y-1.5">
                          <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest">
                            Favorite
                          </span>
                          <button
                            type="button"
                            onClick={() => field.handleChange(!isFav)}
                            className={cn(
                              "group flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none",
                              isFav
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-500 shadow-[0_0_12px_-2px_rgba(245,158,11,0.3)]"
                                : "border-border/50 bg-transparent text-muted-foreground/30 hover:border-amber-500/20 hover:text-muted-foreground/60",
                            )}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4 transition-all duration-200",
                                isFav
                                  ? "scale-110 fill-amber-500 text-amber-500"
                                  : "fill-transparent group-hover:scale-105",
                              )}
                            />
                          </button>
                        </div>
                      );
                    }}
                  </form.AppField>
                </div>

                {/* Notes */}
                <form.AppField name="note">
                  {(field) => (
                    <field.Textarea
                      placeholder="Write your thoughts..."
                      classNames={{
                        label: "text-[9px] uppercase tracking-widest text-muted-foreground/60",
                        input: cn(
                          "min-h-[100px] resize-none border-border/40 bg-muted/30 text-xs",
                          "placeholder:text-muted-foreground/30",
                          "focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20",
                        ),
                      }}
                    />
                  )}
                </form.AppField>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-border/50 to-transparent" />

              {/* ── Organization ── */}
              <div className="space-y-4">
                <SectionLabel>Organization</SectionLabel>

                {/* Tags */}
                <form.AppField name="tagIds">
                  {(field) => (
                    <field.ButtonGroup
                      label="Tags"
                      options={tagsQuery.data}
                      className="grid max-h-40 grid-cols-2 gap-1 overflow-y-auto pr-1"
                      classNames={{
                        label: "text-[9px] uppercase tracking-widest text-muted-foreground/60",
                      }}
                    />
                  )}
                </form.AppField>

                {/* Collections */}
                <form.AppField name="collectionIds">
                  {(field) => (
                    <field.TreeSelector
                      label="Collections"
                      options={collectionsQuery.data}
                      className="max-h-48"
                      classNames={{
                        label: "text-[9px] uppercase tracking-widest text-muted-foreground/60",
                      }}
                    />
                  )}
                </form.AppField>
              </div>
            </div>
          </ScrollArea>

          {/* ── Footer ── */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-amber-500/10 border-t bg-gradient-to-b from-transparent to-amber-500/[0.02] p-5">
            <Button
              variant="ghost"
              size="sm"
              className="text-[11px] text-muted-foreground hover:text-foreground"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </Button>
            <form.AppForm>
              <form.SubmitButton className="bg-amber-500 text-[11px] text-black shadow-amber-500/20 shadow-lg transition-all hover:bg-amber-400 hover:shadow-amber-500/30">
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </form.SubmitButton>
            </form.AppForm>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
