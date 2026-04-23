import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/links/")({
  component: LinksPage,
});

function LinksPage() {
  return <p>Coming soon...</p>;
}
