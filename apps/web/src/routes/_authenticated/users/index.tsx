import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/users/")({
  head: () => ({ meta: [{ title: "Users" }] }),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/users/"!</div>;
}
