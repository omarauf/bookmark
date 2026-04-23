import { createFileRoute } from "@tanstack/react-router";
import { LinkSchemas } from "@workspace/contracts/link";
import z from "zod";
import { LinkBrowserView } from "@/modules/link/browser";
import { Toolbar } from "@/modules/link/components/toolbar";
import { LinkTable } from "@/modules/link/table";

const searchSchema = z
  .discriminatedUnion("view", [
    LinkSchemas.tree.request.extend({ view: z.literal("tree") }),
    LinkSchemas.list.request.extend({ view: z.literal("table") }),
  ])
  .catch({ view: "tree" });

// const searchSchema = LinkSchemas.tree.request.extend({
//   view: z.enum(["tree", "table"]).default("tree").catch("tree"),
// });

export const Route = createFileRoute("/_authenticated/links/")({
  component: LinksPage,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
});

function LinksPage() {
  const view = Route.useSearch({ select: (s) => s.view });

  return (
    <div
      className="h-full w-full overflow-hidden rounded-xl border border-l"
      style={{ display: "grid", gridTemplateRows: "auto 1fr" }}
    >
      <Toolbar className="border-b" />

      {view === "tree" && <LinkBrowserView />}

      {view === "table" && <LinkTable />}
    </div>
  );
}
