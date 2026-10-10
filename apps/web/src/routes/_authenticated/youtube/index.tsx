import { createFileRoute } from "@tanstack/react-router";
import { YoutubeSchemas } from "@workspace/contracts/views/youtube";
import { Tv } from "lucide-react";
import { Main } from "@/layout/main";
import { YoutubeFilter } from "@/modules/youtube/filter";
import { YoutubeList } from "@/modules/youtube/list";

export const Route = createFileRoute("/_authenticated/youtube/")({
  component: YoutubePage,
  validateSearch: YoutubeSchemas.list.request,
});

function YoutubePage() {
  return (
    <Main layout="fixed" icon={Tv} breadcrumbs={[{ label: "Youtube" }]} className="p-0">
      <YoutubeFilter />

      <YoutubeList />
    </Main>
  );
}
