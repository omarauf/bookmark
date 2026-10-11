import { createFileRoute } from "@tanstack/react-router";
import { Folder } from "lucide-react";
import z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Main } from "@/layout/main";
import { CollectionFilter } from "@/modules/collections/components/filter";
import { CollectionTable } from "@/modules/collections/table";
import { RenderCollectionTree } from "@/modules/collections/tree";

export const Route = createFileRoute("/_authenticated/collections/")({
  component: Collections,
  validateSearch: z.object({
    view: z.enum(["tree", "table"]).optional().default("tree"),
    search: z.coerce.string().optional(),
  }),
});

function Collections() {
  const { view } = Route.useSearch();

  return (
    <Main icon={Folder} className="p-0" layout="fixed" breadcrumbs={[{ label: "Collections" }]}>
      <CollectionFilter className="border-border/50 border-b px-4 py-3" />

      <ScrollArea className="min-h-0 px-4 py-4">
        {view === "tree" ? <RenderCollectionTree /> : <CollectionTable />}
      </ScrollArea>
    </Main>
  );
}
