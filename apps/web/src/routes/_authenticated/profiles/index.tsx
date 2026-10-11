import { createFileRoute } from "@tanstack/react-router";
import { ProfileSchemas } from "@workspace/contracts/views/profile";
import { UserCircle } from "lucide-react";
import z from "zod";
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
    <Main breadcrumbs={[{ label: "Profiles" }]} icon={UserCircle} className="p-0" layout="fixed">
      <ProfileFilter className="border-border/50 border-b px-4 py-3" />

      {view === "table" ? <ProfileTable /> : <ProfileList />}
    </Main>
  );
}
