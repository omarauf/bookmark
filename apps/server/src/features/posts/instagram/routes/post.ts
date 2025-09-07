import type { InstagramPost, PopulatedInstagramPost } from "@workspace/contracts/instagram/post";
import { ListInstagramPostSchema } from "@workspace/contracts/instagram/post";
import { type FilterQuery, type SortOrder, Types } from "mongoose";
import { publicProcedure } from "@/lib/orpc";
import { InstagramPostModel } from "../models/post";
import { InstagramUserModel } from "../models/user";

export const instagramPostRouter = {
  list: publicProcedure.input(ListInstagramPostSchema).handler(async ({ input }) => {
    const { limit = 10, page = 1 } = input;
    const skip = (page - 1) * limit;
    const filter: FilterQuery<InstagramPost> = {};

    if (input.mediaType) {
      filter["media.mediaType"] = input.mediaType;
    }

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
      const users = await InstagramUserModel.find({
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
      InstagramPostModel.find<PopulatedInstagramPost>(filter)
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
        .populate("userTags.user")
        .populate("collections")
        .exec(),
      InstagramPostModel.countDocuments(filter),
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
};
