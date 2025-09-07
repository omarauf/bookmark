import { ORPCError } from "@orpc/server";
import {
  CreateUserSchema,
  DeleteAllUserSchema,
  DeleteUserSchema,
  ListUserSchema,
  UpdateUserSchema,
} from "@workspace/contracts/user";
import { publicProcedure } from "@/lib/orpc";
import { UserModel } from "../models/user";

export const userRouter = {
  list: publicProcedure.input(ListUserSchema).handler(async ({ input }) => {
    const { limit = 10, page = 1 } = input;
    const skip = (page - 1) * limit;

    // if (tags && tags.length > 0) {
    //   filter.tags = { $in: tags.map((tagId) => new Types.ObjectId(tagId)) };
    // }

    const [items, total] = await Promise.all([
      UserModel.find({})
        .sort({ savedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("collections")
        .exec(),
      UserModel.countDocuments({}),
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

  create: publicProcedure.input(CreateUserSchema).handler(async ({ input }) => {
    const { username } = input;
    const user = await UserModel.find({ username });
    if (user) throw new ORPCError("CONFLICT", { message: "User already exists" });

    await UserModel.create(input);
  }),

  update: publicProcedure.input(UpdateUserSchema).handler(async ({ input: { id, ...rest } }) => {
    await UserModel.updateOne({ _id: id }, { ...rest });
    return;
  }),

  deleteAll: publicProcedure.input(DeleteAllUserSchema).handler(async ({ input: { hard } }) => {
    if (hard) await UserModel.deleteMany({});
    else await UserModel.updateMany({}, { deletedAt: new Date() });
  }),

  delete: publicProcedure.input(DeleteUserSchema).handler(async ({ input: { id, hard } }) => {
    const user = await UserModel.findById(id);
    if (!user) throw new ORPCError("NOT_FOUND", { message: "User not found" });
    if (hard) await UserModel.deleteOne({ _id: id });
    else await UserModel.updateOne({ _id: id }, { deletedAt: new Date() });
  }),
};
