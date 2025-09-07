import {
  type CollectionWithCount,
  CreateCollectionSchema,
  DeleteCollectionSchema,
  ListCollectionSchema,
  UpdateCollectionSchema,
} from "@workspace/contracts/collection";
import { publicProcedure } from "@/lib/orpc";
import { PostModel } from "../posts/base/models/post";
import { CollectionModel } from "./model";

export const collectionRouter = {
  list: publicProcedure.input(ListCollectionSchema).handler(async ({ input: { name } }) => {
    const collections = await CollectionModel.aggregate<CollectionWithCount>()
      .match({ ...(name ? { name: { $regex: name, $options: "i" } } : {}) })
      .lookup({
        from: PostModel.collection.name,
        localField: "_id",
        foreignField: "collections",
        as: "posts",
      })
      .addFields({ count: { $size: "$posts" }, id: { $toString: "$_id" } })
      .project({ posts: 0 })
      // .sort({ ...(sortBy === "count" ? { count: -1 } : sortBy === "name" ? { name: 1 } : {}) })
      .exec();

    return collections;
  }),

  create: publicProcedure.input(CreateCollectionSchema).handler(async ({ input }) => {
    await CollectionModel.create(input);
    return;
  }),

  update: publicProcedure
    .input(UpdateCollectionSchema)
    .handler(async ({ input: { id, ...rest } }) => {
      await CollectionModel.updateOne({ _id: id }, { ...rest });
      return;
    }),

  delete: publicProcedure.input(DeleteCollectionSchema).handler(async ({ input: { id } }) => {
    await CollectionModel.deleteOne({ _id: id });
  }),
};
