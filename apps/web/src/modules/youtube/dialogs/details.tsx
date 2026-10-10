import type { Youtube } from "@workspace/contracts/views/youtube";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YoutubeDetailsContent } from "../components/details-content";
import { YoutubeMediaPreview } from "../components/media-preview";
import { YoutubeUpdateForm } from "../components/update-form";

type Props = {
  youtube: Youtube;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tab: "details" | "update";
  onTabChange: (tab: "details" | "update") => void;
};

export function YoutubeDetailsDialog({ youtube, open, onOpenChange, tab, onTabChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-[90vh] w-full flex-col gap-0 overflow-hidden border border-border/50 bg-background p-0 shadow-2xl sm:h-[min(85vh,48rem)] sm:max-w-6xl sm:flex-row"
        initialFocus={false}
      >
        <DialogTitle className="sr-only">{youtube.caption ?? youtube.externalId}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {youtube.caption ?? youtube.externalId}
        </DialogDescription>

        {/* Media Column */}
        <YoutubeMediaPreview youtube={youtube} />

        {/* Shared header and tabbed content */}
        <Tabs
          value={tab}
          onValueChange={(value) => onTabChange(value as "details" | "update")}
          className="min-h-0 min-w-0 flex-1 gap-0"
        >
          {/* Header */}
          <h2 className="px-5 pt-5 font-semibold text-base text-foreground leading-snug">
            {youtube.caption ?? youtube.externalId}
          </h2>

          <div className="shrink-0 border-border/50 border-b px-5 py-2">
            <TabsList variant="line">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="update">Update</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details" className="min-h-0 overflow-hidden">
            <YoutubeDetailsContent youtube={youtube} />
          </TabsContent>

          <TabsContent
            value="update"
            keepMounted
            className="flex min-h-0 flex-col data-hidden:hidden"
          >
            <YoutubeUpdateForm youtube={youtube} onClose={() => onOpenChange(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
