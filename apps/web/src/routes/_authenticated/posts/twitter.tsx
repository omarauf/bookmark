import { createFileRoute } from "@tanstack/react-router";
import { PostSchemas } from "@workspace/contracts/views/post";
import z from "zod";
import { Posts } from "@/modules/post";

export const Route = createFileRoute("/_authenticated/posts/twitter")({
  component: Posts,
  validateSearch: PostSchemas.list.request.extend({
    platform: z.literal("twitter").optional().default("twitter"),
  }),
});
