import { createFileRoute } from "@tanstack/react-router";
import Loader from "@/components/loader";
import { LinkLayout } from "@/features/link/layout";
import { SearchLinkSchema } from "@/features/link/schema";
import { getFilterType } from "@/features/link/utils";
import { ListLinkView } from "@/features/link/view/list";
import { TreeLinkView } from "@/features/link/view/tree";

export const Route = createFileRoute("/links/")({
  component: LinksPage,
  validateSearch: SearchLinkSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { orpc, queryClient }, deps }) => {
    const { q, path, domain } = deps;
    const type = getFilterType(deps);

    if (type === "tree") {
      await queryClient.ensureQueryData(orpc.links.tree.queryOptions({ input: { path, type } }));
    }
    //
    else {
      await queryClient.prefetchInfiniteQuery(
        orpc.links.list.infiniteOptions({
          initialPageParam: 1,
          input: (searchParams) => ({ page: searchParams, limit: 50, q, domain }),
          getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
        }),
      );
    }
    return;
  },
  pendingComponent: () => (
    <LinkLayout>
      <Loader className="items-start" />
    </LinkLayout>
  ),
});

function LinksPage() {
  const search = Route.useSearch();
  const type = getFilterType(search);

  return <LinkLayout>{type === "list" ? <ListLinkView /> : <TreeLinkView />}</LinkLayout>;
}
