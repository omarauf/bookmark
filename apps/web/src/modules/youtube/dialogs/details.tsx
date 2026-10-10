import type { Youtube } from "@workspace/contracts/views/youtube";
import { cn } from "cn";
import { Columns3, LayoutPanelLeft } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { YoutubeDetailsContent } from "../components/details-content";
import { YoutubeMediaActions } from "../components/media-actions";
import { YoutubeMediaPreview } from "../components/media-preview";
import { YoutubeUpdateForm } from "../components/update-form";

type Props = {
  youtube: Youtube;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function YoutubeDetailsDialog({ youtube, open, onOpenChange }: Props) {
  const [layout, setLayout] = useState<"D" | "E">("D");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] w-full flex-col gap-0 overflow-hidden border border-border/50 bg-black p-0 text-white shadow-2xl sm:h-[min(85vh,48rem)] sm:max-w-6xl">
        <DialogTitle className="sr-only">{youtube.caption ?? youtube.externalId}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {youtube.caption ?? youtube.externalId}
        </DialogDescription>

        <div
          className={cn(
            "grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(8rem,24vh)_minmax(0,1fr)_minmax(0,1fr)]",
            layout === "D"
              ? "lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)_minmax(0,3fr)] lg:grid-rows-1"
              : "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-rows-2",
          )}
        >
          <YoutubeMediaPreview
            youtube={youtube}
            className="col-start-1 row-start-1 border-border/50 border-b lg:border-r"
          />
          <section
            className={cn(
              "min-h-0 min-w-0 overflow-hidden border-border/50 border-b",
              layout === "D"
                ? "row-start-2 lg:col-start-2 lg:row-start-1 lg:border-r lg:border-b-0"
                : "row-start-3 border-b-0 lg:col-start-1 lg:row-start-2 lg:border-r",
            )}
          >
            <YoutubeDetailsContent youtube={youtube} />
          </section>

          <div
            className={cn(
              "flex min-h-0 min-w-0 flex-col",
              layout === "D"
                ? "row-start-3 lg:col-start-3 lg:row-start-1"
                : "row-start-2 border-border/50 border-b lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:border-b-0",
            )}
          >
            <div className="flex shrink-0 items-center justify-between gap-2 border-border/50 border-b px-5 py-3 lg:pr-12">
              <YoutubeMediaActions youtube={youtube} />

              <ToggleGroup
                value={[layout]}
                onValueChange={(values) => setLayout(values[0] as "D" | "E")}
                variant="outline"
                size="sm"
                spacing={0}
              >
                <ToggleGroupItem value="D">
                  <Columns3 />
                </ToggleGroupItem>
                <ToggleGroupItem value="E">
                  <LayoutPanelLeft className="rotate-180" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <YoutubeUpdateForm youtube={youtube} onClose={() => onOpenChange(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
