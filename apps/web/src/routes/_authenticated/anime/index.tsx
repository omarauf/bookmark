import { createFileRoute } from "@tanstack/react-router";
import { AnimeSchemas } from "@workspace/contracts/views/anime";
import { Tv } from "lucide-react";
import z from "zod";
import { Main } from "@/layout/main";
import { AnimeFilter } from "@/modules/anime/filter";
import { AnimeList } from "@/modules/anime/list";

export const Route = createFileRoute("/_authenticated/anime/")({
  component: AnimePage,
  validateSearch: AnimeSchemas.list.request.extend({
    mode: z.enum(["view", "update"]).optional().catch(undefined),
  }),
});

function AnimePage() {
  return (
    <Main icon={Tv} breadcrumbs={[{ label: "Anime" }]}>
      <AnimeFilter />

      <AnimeList />
    </Main>
  );
}
