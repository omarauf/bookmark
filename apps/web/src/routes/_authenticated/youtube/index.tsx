import { createFileRoute } from "@tanstack/react-router";
import { YoutubeSchemas } from "@workspace/contracts/views/youtube";
import { Tv } from "lucide-react";
import z from "zod";
import { Header } from "@/layout/header";
import { Main } from "@/layout/main";
import { YoutubeFilter } from "@/modules/youtube/filter";
import { useYoutubeQuery } from "@/modules/youtube/hooks/use-youtube-query";
import { YoutubeList } from "@/modules/youtube/list";

export const Route = createFileRoute("/_authenticated/youtube/")({
  component: YoutubePage,
  validateSearch: YoutubeSchemas.list.request.extend({
    update: z.boolean().optional(),
  }),
});

function YoutubePage() {
  const query = useYoutubeQuery();
  const total = query.data?.pages[0]?.total ?? 0;

  return (
    <Main className="flex h-full flex-col p-0">
      <Header className="border-border/50 border-b">
        <div className="flex items-center gap-3 px-6 py-3">
          <Tv className="h-4 w-4 text-muted-foreground" />
          <h1 className="font-medium text-lg tracking-tight">Youtube</h1>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            MyYoutube
          </span>
          <span className="text-[10px] text-muted-foreground/60">{total.toLocaleString()}</span>
        </div>
      </Header>

      <YoutubeFilter />

      <YoutubeList />
    </Main>
  );
}
