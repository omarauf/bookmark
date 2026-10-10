import { YoutubeSchemas } from "@workspace/contracts/views/youtube";
import { YoutubeMetadataSchema } from "@workspace/contracts/youtube";
import { and, asc, count, desc, eq, exists, ilike, isNull, notExists, sql } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { items } from "@/modules/item/schema";
import { createSingleJob } from "@/modules/job/service";
import { media } from "@/modules/media/schema";
import { youtubeClient, ytDlpClient } from "./integrations";
import { getYoutubeMetadata } from "./mapper";
import { mapItemToYoutube } from "./mapper-2";

export const youtubeRouter = {
  list: protectedProcedure
    .input(YoutubeSchemas.list.request)
    .output(YoutubeSchemas.list.response)
    .handler(async ({ input }) => {
      const offset = (input.page - 1) * input.perPage;

      const { q, downloadStatus } = input;

      const videoMedia = db
        .select({ id: media.id })
        .from(media)
        .where(and(eq(media.itemId, items.id), eq(media.type, "video")));

      const conditions = and(
        eq(items.platform, "youtube"),
        isNull(items.deletedAt),
        q ? ilike(items.caption, `%${q}%`) : undefined,
        downloadStatus === "downloaded"
          ? exists(videoMedia)
          : downloadStatus === "not_downloaded"
            ? notExists(videoMedia)
            : undefined,
      );

      const orderBy = {
        createdAt: desc(items.createdAt),
        publishedAt: desc(sql`(${items.metadata}->>'publishedAt')::timestamptz`),
        views: desc(sql`(${items.metadata}->>'views')::bigint`),
        duration: asc(sql`(${items.metadata}->>'duration')::double precision`),
      }[input.sortBy ?? "createdAt"];

      const [data, [{ totalCount }]] = await Promise.all([
        db.query.items.findMany({
          where: conditions,
          with: {
            collections: {
              with: {
                collection: { columns: { id: true, label: true, color: true } },
              },
            },
            tags: {
              with: { tag: { columns: { id: true, name: true, color: true } } },
            },
            media: true,
          },
          limit: input.perPage,
          offset,
          orderBy: [orderBy, desc(items.id)],
        }),
        db.select({ totalCount: count() }).from(items).where(conditions),
      ]);

      return {
        items: mapItemToYoutube(data),
        total: totalCount,
        page: input.page,
        perPage: input.perPage,
        totalPages: Math.ceil(totalCount / input.perPage),
        hasNextPage: input.page < Math.ceil(totalCount / input.perPage),
        hasPreviousPage: input.page > 1,
      };
    }),

  sync: protectedProcedure.handler(async () => {
    const job = await createSingleJob({
      type: "youtube_discover",
      status: "pending",
      payload: {},
    });

    return job;
  }),

  refresh: protectedProcedure
    .input(YoutubeSchemas.refresh.request)
    .output(YoutubeSchemas.refresh.response)
    .errors({
      NOT_FOUND: { message: "YouTube item not found" },
      BAD_REQUEST: { message: "Item is not a YouTube video" },
      BAD_GATEWAY: { message: "Could not refresh YouTube details" },
      METADATA_PARSE_ERROR: { message: "Failed to parse YouTube metadata", status: 400 },
    })
    .handler(async ({ input: { id }, errors }) => {
      const condition = and(eq(items.id, id), isNull(items.deletedAt));
      const item = await db.query.items.findFirst({ where: condition });
      if (!item) throw errors.NOT_FOUND();
      if (item.platform !== "youtube" || item.kind !== "video") throw errors.BAD_REQUEST();

      const [data, error] = await youtubeClient.getByVideoId(item.externalId);
      if (error || !data) throw errors.BAD_GATEWAY({ message: error });
      const video = data.items[0];
      if (!video) throw errors.NOT_FOUND({ message: "Video is unavailable on YouTube" });

      const result = YoutubeMetadataSchema.safeParse(getYoutubeMetadata(data));
      if (!result.success) throw errors.METADATA_PARSE_ERROR();
      const metadata = result.data;
      await db.update(items).set({ caption: video.snippet.title, metadata }).where(condition);

      return { success: true };
    }),

  listFormats: protectedProcedure
    .input(YoutubeSchemas.listFormats.request)
    .output(YoutubeSchemas.listFormats.response)
    .errors({
      NOT_FOUND: { message: "Item not found" },
      BAD_REQUEST: { message: "Invalid item" },
    })
    .handler(async ({ input: { id }, errors }) => {
      const item = await db.query.items.findFirst({
        where: eq(items.id, id),
        columns: { id: true, platform: true, url: true },
      });
      if (!item) throw errors.NOT_FOUND();
      if (item.platform !== "youtube") throw errors.BAD_REQUEST();

      const result = await ytDlpClient.listFormats(item.url);
      if (!result.ok) throw errors.BAD_REQUEST({ message: result.error });

      return { formats: result.data };
    }),

  download: protectedProcedure
    .input(YoutubeSchemas.download.request)
    .output(YoutubeSchemas.download.response)
    .errors({
      NOT_FOUND: { message: "Item not found" },
      BAD_REQUEST: { message: "Invalid item" },
    })
    .handler(async ({ input: { id, formatId }, errors }) => {
      const item = await db.query.items.findFirst({ where: eq(items.id, id) });
      if (!item) throw errors.NOT_FOUND();
      if (item.platform !== "youtube") throw errors.BAD_REQUEST();

      const result = await ytDlpClient.listFormats(item.url);
      if (!result.ok) throw errors.BAD_REQUEST({ message: result.error });

      const format = result.data.find((f) => f.formatId === formatId);
      if (!format) throw errors.BAD_REQUEST({ message: "Format not found" });

      const needsMerge = format.hasVideo && !format.hasAudio;
      const downloadFormatId = needsMerge ? `${formatId}+bestaudio` : formatId;
      const ext = needsMerge ? "mp4" : format.ext;

      const job = await createSingleJob({
        type: "youtube_download",
        status: "pending",
        resourceType: "youtube",
        resourceId: `${item.externalId}_${formatId}`,
        payload: {
          itemId: item.id,
          formatId: downloadFormatId,
          url: item.url,
          ext,
          needsMerge,
        },
      });

      return { jobId: job.id };
    }),
};
