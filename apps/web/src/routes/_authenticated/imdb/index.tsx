import { createFileRoute } from "@tanstack/react-router";
import { ImdbSchemas } from "@workspace/contracts/views/imdb";
import { Film } from "lucide-react";
import z from "zod";
import { Header } from "@/layout/header";
import { Main } from "@/layout/main";
import { ImdbFilter } from "@/modules/imdb/filter";
import { ImdbList } from "@/modules/imdb/list";

export const Route = createFileRoute("/_authenticated/imdb/")({
  component: ImdbPage,
  validateSearch: ImdbSchemas.list.request.extend({
    update: z.boolean().optional(),
  }),
});

function ImdbPage() {
  return (
    <Main className="flex h-full flex-col p-0">
      <Header className="border-border/50 border-b">
        <div className="flex items-center gap-3 px-6 py-3">
          <Film className="h-4 w-4 text-muted-foreground" />
          <h1 className="font-medium font-mono text-lg tracking-tight">IMDb</h1>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Entertainment
          </span>
        </div>
      </Header>

      <ImdbFilter />

      <ImdbList />
    </Main>
  );
}
