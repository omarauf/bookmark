import type { Media } from "@workspace/contracts/media";
import { PostSchemas } from "@workspace/contracts/post";
import { count, eq, getTableColumns, isNull, sql } from "drizzle-orm";
import { db } from "@/core/db";
import { withPagination } from "@/core/db/helper/pagination";
import { protectedProcedure } from "@/lib/orpc";
import { creators } from "../creator/schema";
import { media } from "../media/schema";
import { normalizeMedia } from "../media/service";
import { postRepo } from "./repo";
import { posts } from "./schema";
import { fetchPost } from "./service";

export const postRouter = {
  list: protectedProcedure
    .input(PostSchemas.list.request)
    .output(PostSchemas.list.response)
    .handler(async ({ input }) => {
      const filters = input.platform ? eq(posts.platform, input.platform) : undefined;

      const dataQuery = db
        .select({
          ...getTableColumns(posts),
          creator: creators,
          media: sql<Media[]>`
          (
            SELECT COALESCE(json_agg(${media}), '[]'::json)
            FROM ${media}
            WHERE ${media.referenceId} = ${posts.id}
          )`,
        })
        .from(posts)
        .innerJoin(creators, eq(creators.id, posts.creatorId));

      const countQuery = db.select({ count: count() }).from(posts);

      const data = await withPagination({
        dataQuery,
        countQuery,
        filters,
        page: input.page,
        perPage: input.perPage,
        orderByColumn: posts.createdAt,
        orderDirection: "desc",
      });

      return {
        ...data,
        items: data.items.map((item) => {
          const { creator, media, ...post } = item;

          return {
            ...post,
            creator: {
              ...creator,
              verified: creator.verified || undefined,
              name: creator.name || undefined,
              avatar: `${creator.platform}/avatar/${creator.externalId}.jpg`,
            },
            media: normalizeMedia(media),
            quotedPostId: post.quotedPostId || undefined,
            tags: [],
            collections: [],
            note: post.note || undefined,
            rate: post.rate || undefined,
            caption: post.caption || undefined,
            deletedAt: post.deletedAt || undefined,
            favorite: post.favorite || undefined,
          };
        }),
      };
    }),

  get: protectedProcedure
    .input(PostSchemas.get.request)
    .output(PostSchemas.get.response)
    .errors({ NOT_FOUND: { message: "Post not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const post = await fetchPost(id);

      if (!post) throw errors.NOT_FOUND();

      return post;
    }),

  update: protectedProcedure
    .input(PostSchemas.update.request)
    .output(PostSchemas.update.response)
    .errors({ NOT_FOUND: { message: "Post not found" } })
    .handler(async ({ input: { id, ...rest }, errors }) => {
      const post = await postRepo.findById(id);

      if (!post) throw errors.NOT_FOUND();

      await postRepo.update(id, rest);
    }),

  delete: protectedProcedure
    .input(PostSchemas.delete.request)
    .output(PostSchemas.delete.response)
    .errors({ NOT_FOUND: { message: "Post not found" } })
    .handler(async ({ input: { id, hard }, errors }) => {
      const post = await postRepo.findById(id);
      if (!post) throw errors.NOT_FOUND();

      if (hard) {
        await postRepo.delete(id);
        return;
      }

      await postRepo.update(id, { deletedAt: new Date() });
    }),

  deleteAll: protectedProcedure
    .input(PostSchemas.deleteAll.request)
    .output(PostSchemas.deleteAll.response)
    .handler(async ({ input: { hard } }) => {
      if (hard) {
        await db.delete(posts);
        return;
      }

      await db.update(posts).set({ deletedAt: new Date() }).where(isNull(posts.deletedAt));
    }),
};
