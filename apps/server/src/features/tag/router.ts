import type { TagWithCount } from "@workspace/contracts/tag";
import {
  CreateTagSchema,
  DeleteTagSchema,
  ListTagSchema,
  UpdateTagSchema,
} from "@workspace/contracts/tag";
import { publicProcedure } from "@/lib/orpc";
import { PostModel } from "../posts/base/models/post";
import { TagModel } from "./model";

export const tagRouter = {
  list: publicProcedure.input(ListTagSchema).handler(async ({ input: { name } }) => {
    const tags = await TagModel.aggregate<TagWithCount>()
      .match({ ...(name ? { name: { $regex: name, $options: "i" } } : {}) })
      .lookup({
        from: PostModel.collection.name,
        localField: "_id",
        foreignField: "tags",
        as: "posts",
      })
      .addFields({ count: { $size: "$posts" }, id: { $toString: "$_id" } })
      .project({ posts: 0 })
      // .sort({ ...(sortBy === "count" ? { count: -1 } : sortBy === "name" ? { name: 1 } : {}) })
      .exec();

    return tags;
  }),

  create: publicProcedure.input(CreateTagSchema).handler(async ({ input }) => {
    const tag = await TagModel.create(input);
    return tag;
  }),

  update: publicProcedure.input(UpdateTagSchema).handler(async ({ input: { id, ...rest } }) => {
    await TagModel.updateOne({ _id: id }, { ...rest });
    return;
  }),

  delete: publicProcedure.input(DeleteTagSchema).handler(async ({ input: { id } }) => {
    await TagModel.deleteOne({ _id: id });
  }),
};
