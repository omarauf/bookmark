import { createFileRoute } from "@tanstack/react-router";
import { ProfileSchemas } from "@workspace/contracts/views/profile";
import z from "zod";
import { Header } from "@/layout/header";
import { Main } from "@/layout/main";
import { ProfileFilter } from "@/modules/profile/components/filter";
import { ProfileList } from "@/modules/profile/views/list";
import { ProfileTable } from "@/modules/profile/views/table";

const searchSchema = ProfileSchemas.list.request.extend({
  view: z.enum(["card", "table"]).optional().catch("card"),
});

export const Route = createFileRoute("/_authenticated/profiles/")({
  component: ProfilesPage,
  validateSearch: searchSchema,
});

function ProfilesPage() {
  const view = Route.useSearch({ select: (s) => s.view });

  return (
    <Main className="flex h-full flex-col p-0">
      <Header className="border-b">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg">Profiles</h1>
        </div>
      </Header>

      <ProfileFilter />

      {view === "table" ? <ProfileTable /> : <ProfileList />}
    </Main>
  );
}
