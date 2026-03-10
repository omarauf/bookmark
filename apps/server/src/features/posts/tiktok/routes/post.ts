import type { PopulatedTiktokPost, TiktokPost } from "@workspace/contracts/tiktok/post";
import { ListTiktokPostSchema } from "@workspace/contracts/tiktok/post";
import { type FilterQuery, type SortOrder, Types } from "mongoose";
import { publicProcedure } from "@/lib/orpc";
import { TiktokPostModel } from "../models/post";
import { TiktokUserModel } from "../models/user";

export const tiktokPostRouter = {
  list: publicProcedure.input(ListTiktokPostSchema).handler(async ({ input }) => {
    const { limit = 10, page = 1 } = input;
    const skip = (page - 1) * limit;
    const filter: FilterQuery<TiktokPost> = {};

    if (input.collections && input.collections.length > 0) {
      // filter.collections = { $in: collections.map((colId) => new Types.ObjectId(colId)) };
      filter.collections = {
        $all: input.collections.map((colId) => new Types.ObjectId(colId)),
      };
    }

    if (input.tags && input.tags.length > 0) {
      // filter.collections = { $in: collections.map((colId) => new Types.ObjectId(colId)) };
      filter.tags = { $all: input.tags.map((colId) => new Types.ObjectId(colId)) };
    }

    if (input.username) {
      const users = await TiktokUserModel.find({
        username: { $regex: new RegExp(input.username, "i") },
      }).exec();
      if (users.length === 0) {
        return {
          items: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      }

      const userIds = users.map((user) => user._id);
      filter.creator = { $in: userIds };

      // if (userTypes.length === 0 || userTypes.includes('creator')) {
      //   filter.creator = { $in: userIds };
      // }

      // if (userTypes.includes('tagged')) {
      //   filter['userTags.user'] = { $in: userIds };
      // }
    }

    if (input.minDate || input.maxDate) {
      filter.createdAt = {};
      if (input.minDate) filter.createdAt.$gte = new Date(input.minDate);

      if (input.maxDate) filter.createdAt.$lte = new Date(input.maxDate);
    }

    const sort: Record<string, SortOrder> | null = null;
    // if (input.sortOrder)
    //   sort = {
    //     [input.sortBy || "createdAt"]: input.sortOrder === "asc" ? 1 : -1,
    //   };

    const [items, total] = await Promise.all([
      TiktokPostModel.find<PopulatedTiktokPost>(filter)
        .find({
          createdAt: {
            $gte: new Date(input.minDate || "1970-01-01"),
          },
        })
        .sort(sort || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("creator")
        .populate("tags")
        .populate("collections")
        .exec(),
      TiktokPostModel.countDocuments(filter),
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

  test: publicProcedure.handler(async () => {
    const a = TiktokPostModel.find<PopulatedTiktokPost>()
      .find({
        // media: { $exists: true, $not: { $size: 0 } },
        media: { $size: 4 },
      })
      .populate("creator")
      .populate("tags")
      .populate("collections")
      .exec();

    return a;
  }),
};
