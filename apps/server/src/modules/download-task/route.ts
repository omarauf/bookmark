import { DownloadTaskSchemas } from "@workspace/contracts/download-task";
import { and, count, eq } from "drizzle-orm";
import { db } from "@/core/db";
import { withPagination } from "@/core/db/helper/pagination";
import { publicProcedure } from "@/lib/orpc";
import { downloadTasks } from "./schema";

export const downloadTaskRouter = {
  list: publicProcedure
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

  stats: publicProcedure.output(DownloadTaskSchemas.stats.response).handler(async () => {
    const stats = await db
      .select({
        status: downloadTasks.status,
        count: count(),
      })
      .from(downloadTasks)
      .groupBy(downloadTasks.status);

    const result = {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      exists: 0,
    };

    for (const stat of stats) {
      const value = Number(stat.count);
      result.total += value;
      if (stat.status in result) {
        result[stat.status as keyof typeof result] = value;
      }
    }

    return result;
  }),
};
