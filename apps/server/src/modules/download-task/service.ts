import type { CreateDownloadTask } from "@workspace/contracts/download-task";
import { and, asc, eq, inArray, or, sql } from "drizzle-orm";
import { db } from "@/core/db";
import { type DownloadTask, downloadTasks } from "./schema";

export async function addDownloadTask(data: CreateDownloadTask[]) {
  for (const task of data) {
    const [exist] = await db
      .select()
      .from(downloadTasks)
      .where(
        and(
          eq(downloadTasks.key, task.key),
          eq(downloadTasks.type, task.type),
          or(eq(downloadTasks.status, "pending"), eq(downloadTasks.status, "completed")),
        ),
      )
      .limit(1);

    if (exist) continue;

    await db.insert(downloadTasks).values({
      platform: task.platform,
      type: task.type,
      url: task.url,
      referenceType: task.referenceType,
      externalId: task.externalId,
      size: task.size,
      width: task.width,
      height: task.height,
      duration: task.duration,
      key: task.key,
    });
  }
}

export async function claimTasks(batchSize: number) {
  // const tasks = await db.execute<DownloadTask>(sql`
  //   UPDATE download_tasks
  //   SET status = 'processing'
  //   WHERE id IN (
  //       SELECT id
  //       FROM download_tasks
  //       WHERE status = 'pending'
  //       ORDER BY created_at ASC
  //       LIMIT ${batchSize}
  //       FOR UPDATE SKIP LOCKED
  //   )
  //   RETURNING *;
  // `);
  // return tasks.rows;

  // 1. Create a subquery to select the IDs of tasks to process
  const tasksToProcessQuery = db
    .select({ id: downloadTasks.id })
    .from(downloadTasks)
    .where(eq(downloadTasks.status, "pending"))
    .orderBy(asc(downloadTasks.createdAt))
    .limit(batchSize)
    .for("update", { skipLocked: true });

  // 2. Pass the subquery into the UPDATE statement
  const tasks = await db
    .update(downloadTasks)
    .set({ status: "processing" })
    .where(inArray(downloadTasks.id, tasksToProcessQuery))
    .returning();

  return tasks;
}
