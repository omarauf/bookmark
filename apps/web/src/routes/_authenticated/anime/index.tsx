import { createFileRoute } from "@tanstack/react-router";
import { AnimeSchemas } from "@workspace/contracts/anime-view";
import { Tv } from "lucide-react";
import z from "zod";
import { Header } from "@/layout/header";
import { Main } from "@/layout/main";
import { AnimeFilter } from "@/modules/anime/filter";
import { useAnimeQuery } from "@/modules/anime/hooks/use-anime-query";
import { AnimeList } from "@/modules/anime/list";

export const Route = createFileRoute("/_authenticated/anime/")({
  component: AnimePage,
  validateSearch: AnimeSchemas.list.request.extend({
    update: z.boolean().optional(),
  }),
});

function AnimePage() {
  const query = useAnimeQuery();
  const total = query.data?.pages[0]?.total ?? 0;

  return (
    <Main className="flex h-full flex-col p-0">
      <Header className="border-border/50 border-b">
        <div className="flex items-center gap-3 px-6 py-3">
          <Tv className="h-4 w-4 text-muted-foreground" />
          <h1 className="font-medium font-mono text-lg tracking-tight">Anime</h1>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            MyAnimeList
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/60">
            {total.toLocaleString()}
          </span>
        </div>
      </Header>

      <AnimeFilter />

      <AnimeList />
    </Main>
  );
}
