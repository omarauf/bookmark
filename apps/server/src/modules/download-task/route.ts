import { DownloadTaskSchemas } from "@workspace/contracts/download-task";
import { and, count, eq } from "drizzle-orm";
import type z from "zod";
import { db } from "@/core/db";
import { withPagination } from "@/core/db/helper/pagination";
import { protectedProcedure } from "@/lib/orpc";
import { downloadTasks } from "./schema";

export const downloadTaskRouter = {
  list: protectedProcedure
    .input(DownloadTaskSchemas.list.request)
    .output(DownloadTaskSchemas.list.response)
    .handler(async ({ input }) => {
      const { status, platform } = input;

      const filter = and(
        status ? eq(downloadTasks.status, status) : undefined,
        platform ? eq(downloadTasks.platform, platform) : undefined,
      );

      const dataQuery = db.select().from(downloadTasks);
      const countQuery = db.select({ count: count() }).from(downloadTasks);

      const data = await withPagination({
        dataQuery,
        countQuery,
        filters: filter,
        page: input.page,
        perPage: input.perPage,
        orderByColumn: downloadTasks.createdAt,
        orderDirection: "desc",
      });

      return data;
    }),

  stats: protectedProcedure.output(DownloadTaskSchemas.stats.response).handler(async () => {
    const [statusStats, platformStats, referenceTypeStats] = await Promise.all([
      db
        .select({ status: downloadTasks.status, count: count() })
        .from(downloadTasks)
        .groupBy(downloadTasks.status),
      db
        .select({ platform: downloadTasks.platform, count: count() })
        .from(downloadTasks)
        .groupBy(downloadTasks.platform),
      db
        .select({ referenceType: downloadTasks.referenceType, count: count() })
        .from(downloadTasks)
        .groupBy(downloadTasks.referenceType),
    ]);

    const result: z.infer<typeof DownloadTaskSchemas.stats.response> = {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      exists: 0,
      byPlatform: {
        instagram: 0,
        tiktok: 0,
        twitter: 0,
      },
      byReferenceType: {
        creator: 0,
        post: 0,
      },
    };

    for (const stat of statusStats) {
      const value = Number(stat.count);
      result.total += value;
      if (stat.status in result) {
        result[stat.status] = value;
      }
    }

    for (const stat of platformStats) {
      result.byPlatform[stat.platform] = Number(stat.count);
    }

    for (const stat of referenceTypeStats) {
      result.byReferenceType[stat.referenceType] = Number(stat.count);
    }

    return result;
  }),
};
