import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { List, Network } from "lucide-react";
import z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { CreateCollectionDialog } from "@/modules/collections/dialogs/create";
import { CollectionTable } from "@/modules/collections/table";
import { RenderCollectionTree } from "@/modules/collections/tree";
import { listToTree } from "@/modules/collections/utils";

export const Route = createFileRoute("/_authenticated/collections/")({
  component: Collections,
  validateSearch: z.object({
    view: z.enum(["tree", "table"]).optional().default("tree"),
  }),
  loader: async ({ context: { orpc, queryClient } }) => {
    await queryClient.ensureQueryData(orpc.collection.all.queryOptions());
    return;
  },
});

function Collections() {
  const { view } = Route.useSearch();
  const navigate = Route.useNavigate();

  const query = useSuspenseQuery(orpc.collection.all.queryOptions());
  const collections = query.data;

  return (
    <Main>
      <Tabs
        value={view}
        onValueChange={(v) => navigate({ search: { view: v as "tree" | "table" } })}
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="tree">
              <Network className="mr-2 h-4 w-4" />
              Tree View
            </TabsTrigger>
            <TabsTrigger value="table">
              <List className="mr-2 h-4 w-4" />
              Table View
            </TabsTrigger>
          </TabsList>

          <CreateCollectionDialog />
        </div>

        <TabsContent value="tree" className="mt-6">
          <RenderCollectionTree nodes={listToTree(collections ?? [])} />
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <CollectionTable collections={collections} />
        </TabsContent>
      </Tabs>
    </Main>
  );
}
