import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CollectionSchemas } from "@workspace/contracts/collection";
import { EmptyContent } from "@/components/empty-content";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { CollectionCard } from "@/modules/collections/card";
import { CreateUpdateCollection } from "@/modules/collections/create-update";

export const Route = createFileRoute("/_authenticated/collections/")({
  component: Collections,
  validateSearch: CollectionSchemas.list.request,
  loaderDeps: ({ search: { name } }) => ({ name }),
  loader: async ({ context: { orpc, queryClient }, deps }) => {
    await queryClient.ensureQueryData(orpc.collection.list.queryOptions({ input: deps }));
    return;
  },
});

function Collections() {
  const { name } = Route.useSearch();

  const collectionsQuery = useSuspenseQuery(orpc.collection.list.queryOptions({ input: { name } }));

  return (
    <Main>
      <div className="flex w-full items-center justify-end">
        <CreateUpdateCollection />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {collectionsQuery.data.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>

      <EmptyContent
        show={collectionsQuery.data.length === 0}
        title="No collections found"
        description="You can create a collection by clicking the button above."
      />
    </Main>
  );
}
