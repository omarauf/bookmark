import { createFileRoute } from "@tanstack/react-router";
import { Tag } from "lucide-react";
import z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Main } from "@/layout/main";
import { TagFilter } from "@/modules/tags/components/filter";
import { TagContent } from "@/modules/tags/content";
import { CreateTagDialog } from "@/modules/tags/dialogs/create";

export const Route = createFileRoute("/_authenticated/tags/")({
  component: Tags,
  validateSearch: z.object({
    search: z.string().optional(),
  }),
});

function Tags() {
  return (
    <Main className="flex h-full flex-col px-2">
      {/* Header */}
      <div className="mb-4 px-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-3xl">All Tags</h1>
              <p className="text-muted-foreground">Organize and explore your bookmarks by tags</p>
            </div>
          </div>
          <CreateTagDialog />
        </div>
      </div>

      <TagFilter className="px-4 pb-2" />

      <ScrollArea className="h-full min-h-0" viewportProps={{ className: "pt-4 px-4" }}>
        <TagContent />
      </ScrollArea>
    </Main>
  );
}
