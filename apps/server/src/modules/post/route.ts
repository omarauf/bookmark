import { PostSchemas } from "@workspace/contracts/post";
import { protectedProcedure } from "@/lib/orpc";
import { listPosts } from "./service/list";

export const postRouter = {
  list: protectedProcedure
    .input(PostSchemas.list.request)
    .output(PostSchemas.list.response)
    .handler(async ({ input }) => listPosts(input)),

  // get: protectedProcedure
  //   .input(PostSchemas.get.request)
  //   .output(PostSchemas.get.response)
  //   .errors({ NOT_FOUND: { message: "Post not found" } })
  //   .handler(async ({ input: { id }, errors }) => {
  //     const post = await fetchPost(id);

  //     if (!post) throw errors.NOT_FOUND();

  //     return post;
  //   }),
};
