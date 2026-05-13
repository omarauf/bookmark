import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PostSchemas } from "@workspace/contracts/views/post";

export const Route = createFileRoute("/_authenticated/posts")({
  component: Outlet,
  validateSearch: PostSchemas.list.request,
});
