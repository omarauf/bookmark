import { createFileRoute } from "@tanstack/react-router";
import { ImdbSchemas } from "@workspace/contracts/views/imdb";
import { Film } from "lucide-react";
import z from "zod";
import { Main } from "@/layout/main";
import { ImdbFilter } from "@/modules/imdb/filter";
import { ImdbList } from "@/modules/imdb/list";

export const Route = createFileRoute("/_authenticated/imdb/")({
  component: ImdbPage,
  validateSearch: ImdbSchemas.list.request.extend({
    mode: z.enum(["view", "update"]).optional().catch(undefined),
  }),
});

function ImdbPage() {
  return (
    <Main icon={Film} breadcrumbs={[{ label: "IMDB" }]}>
      <ImdbFilter />

      <ImdbList />
    </Main>
  );
}
