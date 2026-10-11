import { createFileRoute } from "@tanstack/react-router";
import { TagsIcon } from "lucide-react";
import z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Main } from "@/layout/main";
import { TagFilter } from "@/modules/tags/components/filter";
import { TagContent } from "@/modules/tags/content";

export const Route = createFileRoute("/_authenticated/tags/")({
  component: Tags,
  validateSearch: z.object({
    search: z.string().optional(),
  }),
});

function Tags() {
  return (
    <Main icon={TagsIcon} className="p-0" layout="fixed" breadcrumbs={[{ label: "Tags" }]}>
      <TagFilter className="border-border/50 border-b px-4 py-3" />

      <ScrollArea className="min-h-0 px-4 py-4">
        <TagContent />
      </ScrollArea>
    </Main>
  );
}
