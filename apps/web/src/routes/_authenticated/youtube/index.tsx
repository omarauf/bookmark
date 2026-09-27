import { createFileRoute } from "@tanstack/react-router";
import { YoutubeSchemas } from "@workspace/contracts/views/youtube";
import { Tv } from "lucide-react";
import z from "zod";
import { Main } from "@/layout/main";
import { YoutubeFilter } from "@/modules/youtube/filter";
import { YoutubeList } from "@/modules/youtube/list";

export const Route = createFileRoute("/_authenticated/youtube/")({
  component: YoutubePage,
  validateSearch: YoutubeSchemas.list.request.extend({
    update: z.boolean().optional(),
  }),
});

function YoutubePage() {
  return (
    <Main icon={Tv} breadcrumbs={[{ label: "Youtube" }]}>
      <YoutubeFilter />

      <YoutubeList />
    </Main>
  );
}
