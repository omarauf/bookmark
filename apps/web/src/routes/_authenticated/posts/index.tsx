import { createFileRoute } from "@tanstack/react-router";
import { Posts } from "@/modules/post";

export const Route = createFileRoute("/_authenticated/posts/")({
  component: Posts,
});
