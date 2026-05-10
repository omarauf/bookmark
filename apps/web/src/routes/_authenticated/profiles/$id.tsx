import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profiles/$id")({
  component: ProfileDetailPage,
});

function ProfileDetailPage() {
  const { id } = Route.useParams();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <h1 className="font-semibold text-2xl">Profile Detail</h1>
      <p className="text-muted-foreground">Profile ID: {id}</p>
      <p className="text-muted-foreground text-sm">
        This page will display the profile details and associated posts.
      </p>
    </div>
  );
}
