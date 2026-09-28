import { createFileRoute } from "@tanstack/react-router";
import { LinkSchemas } from "@workspace/contracts/views/link";
import z from "zod";
import { Main } from "@/layout/main";
import { LinkBrowserView } from "@/modules/link/browser";
import { Toolbar } from "@/modules/link/components/toolbar";
import { LinkTable } from "@/modules/link/table";

const searchSchema = z
  .discriminatedUnion("view", [
    LinkSchemas.tree.request.extend({ view: z.literal("tree") }),
    LinkSchemas.list.request.extend({ view: z.literal("table") }),
  ])
  .catch({ view: "tree" });

export const Route = createFileRoute("/_authenticated/links/")({
  component: LinksPage,
  validateSearch: searchSchema,
});

function LinksPage() {
  const view = Route.useSearch({ select: (s) => s.view });

  return (
    <Main action={<Toolbar />}>
      {view === "tree" && <LinkBrowserView />}

      {view === "table" && <LinkTable />}
    </Main>
  );
}
