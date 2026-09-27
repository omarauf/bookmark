import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";

export const Route = createFileRoute("/_authenticated/scrapes/$id")({
  component: ScrapeDetailPage,
});

function ScrapeDetailPage() {
  const { id } = Route.useParams();

  const scrapeQuery = useQuery(orpc.scrape.get.queryOptions({ input: { id } }));

  return (
    <Main className="flex h-full flex-col p-0">
      <pre>{JSON.stringify(scrapeQuery.data, null, 2)}</pre>
    </Main>
  );
}
