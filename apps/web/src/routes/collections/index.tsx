import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ListCollectionSchema } from "@workspace/contracts/collection";
import { orpc } from "@/api/rpc";
import { CollectionCard } from "@/apps/collections/card";
import { CreateUpdateCollection } from "@/apps/collections/create-update";
import { EmptyContent } from "@/components/empty-content";
import { Main } from "@/layouts/containers/main";

export const Route = createFileRoute("/collections/")({
  component: Collections,
  validateSearch: ListCollectionSchema,
  loaderDeps: ({ search: { name, sortBy } }) => ({ name, sortBy }),
  loader: async ({ context: { orpc, queryClient }, deps: { name, sortBy } }) => {
    await queryClient.ensureQueryData(
      orpc.collections.list.queryOptions({ input: { name, sortBy } }),
    );
    return;
  },
});

function Collections() {
  const { name, sortBy } = Route.useSearch();

  const collectionsQuery = useSuspenseQuery(
    orpc.collections.list.queryOptions({ input: { name, sortBy } }),
  );

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
