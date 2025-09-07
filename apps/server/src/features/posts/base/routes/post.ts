import { ORPCError } from "@orpc/server";
import {
  CreatePostSchema,
  DeleteAllPostSchema,
  DeletePostSchema,
  ListPostSchema,
  UpdatePostSchema,
} from "@workspace/contracts/post";
import { publicProcedure } from "@/lib/orpc";
import { PostModel } from "../models/post";

export const postRouter = {
  list: publicProcedure.input(ListPostSchema).handler(async ({ input }) => {
    const { limit = 10, page = 1 } = input;
    const skip = (page - 1) * limit;

    // if (tags && tags.length > 0) {
    //   filter.tags = { $in: tags.map((tagId) => new Types.ObjectId(tagId)) };
    // }

    const [items, total] = await Promise.all([
      PostModel.find({})
        .sort({ savedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("collections")
        .exec(),
      PostModel.countDocuments({}),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };
  }),

  insights: publicProcedure.handler(async () => {
    const postsCount = await PostModel.countDocuments({ deletedAt: null });

    return postsCount;
  }),

  create: publicProcedure.input(CreatePostSchema).handler(async ({ input }) => {
    const { postId } = input;
    const post = await PostModel.find({ postId });
    if (post) throw new ORPCError("CONFLICT", { message: "Post already exists" });

    await PostModel.create(input);
  }),

  update: publicProcedure.input(UpdatePostSchema).handler(async ({ input: { id, ...rest } }) => {
    await PostModel.updateOne({ _id: id }, { ...rest });
    return;

    // const post = await PostModel.findById(_id);
    //     if (!post) throw new ORPCError("NOT_FOUND", { message: `Post with ID ${_id} not found` });

    // // if (rest.collections) {
    // //       post.collections = rest.collections.map((collection) => new Types.ObjectId(collection));
    // //     }

    //     if (rest.tags) {
    //       post.tags = rest.tags.map((tag) => new Types.ObjectId(tag));
    //     }

    //     if (rest.note !== undefined) {
    //       post.note = rest.note;
    //     }

    //     if (rest.favorite !== undefined) {
    //       post.favorite = rest.favorite;
    //     }

    //     if (rest.rate !== undefined) {
    //       post.rate = rest.rate;
    //     }
    //   await post.save();

    //     return post;
  }),

  deleteAll: publicProcedure.input(DeleteAllPostSchema).handler(async ({ input: { hard } }) => {
    if (hard) await PostModel.deleteMany({});
    else await PostModel.updateMany({}, { deletedAt: new Date() });
  }),

  delete: publicProcedure.input(DeletePostSchema).handler(async ({ input: { id, hard } }) => {
    const user = await PostModel.findById(id);
    if (!user) throw new ORPCError("NOT_FOUND", { message: "User not found" });

    if (hard) await PostModel.deleteOne({ _id: id });
    else await PostModel.updateOne({ _id: id }, { deletedAt: new Date() });
  }),
};
