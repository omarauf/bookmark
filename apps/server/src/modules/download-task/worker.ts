import { eq } from "drizzle-orm";
import { db } from "@/core/db";
import { s3Client } from "@/core/s3";
import { randomDelay } from "@/utils/delay";
import { items } from "../item/schema";
import { media } from "../media/schema";
import { downloadTaskRepo } from "./repo";
import { type DownloadTask, downloadTasks } from "./schema";
import { claimTasks } from "./service";
import { getFileStreamAndMeta } from "./utils";

// we have 4 workers running in parallel, each will claim 5 tasks and process them concurrently, then sleep for 5 seconds before claiming next batch
// so it will process up to 20 tasks concurrently, and keep processing as long as there are pending tasks in the database
export function startWorkers(workerCount = 4) {
  for (let i = 0; i < workerCount; i++) {
    startWorker();
  }
}

function startWorker() {
  async function loop() {
    try {
      // this will claim a 5 task
      const tasks = await claimTasks(5);

      // run task concurrently
      await Promise.all(tasks.map((task) => processTask(task)));
    } catch (err) {
      console.error("Worker error:", err);
    }

    setTimeout(loop, 5000);
  }

  loop();
}

async function processTask(task: DownloadTask) {
  try {
    const key = task.key;
    const referenceId = await getReferenceId(task);
    await randomDelay(500, 2000);

    if (!referenceId) {
      console.warn(`Reference not found for task ${task.id}, marking as failed`);
      await failTask(task.id, "Reference not found");
      return;
    }

    if (await s3Client.exists(key)) {
      console.log(`File already exists in S3 for task ${task.id}, skipping upload`);
      await saveMediaRecord(task, key, referenceId);
      return;
    }

    const { stream, size, mime } = await getFileStreamAndMeta(task.url);

    const uploadPromise = await s3Client.stream(stream, key);

    if (!uploadPromise) {
      return await failTask(task.id, "S3 Upload failed");
    }

    await saveMediaRecord(task, key, referenceId, { size, mime });
  } catch (error) {
    console.error(`Error processing task ${task.id}:`, error);
    await failTask(task.id, "Unhandled exception during processing");
  }
}

async function getReferenceId(task: DownloadTask) {
  const item = await db.query.items.findFirst({
    where: eq(items.externalId, task.externalId),
    columns: { id: true },
  });
  return item?.id;
}

async function saveMediaRecord(
  task: DownloadTask,
  key: string,
  referenceId: string,
  metadata?: {
    size?: number;
    mime?: string;
    width?: number;
    height?: number;
    duration?: number;
  },
) {
  const meta = {
    size: metadata?.size || task.size,
    mime: metadata?.mime,
    width: metadata?.width || task.width,
    height: metadata?.height || task.height,
    duration: metadata?.duration || task.duration,
  };

  await db.transaction(async (tx) => {
    await tx
      .update(downloadTasks)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(downloadTasks.id, task.id));

    await tx
      .insert(media)
      .values({
        url: task.url,
        key: key,
        platform: task.platform,
        type: task.type,
        itemId: referenceId,
        createdAt: new Date(),
        mime: meta?.mime,
        size: meta?.size,
        width: meta?.width,
        height: meta?.height,
        duration: task.type === "video" ? meta?.duration : undefined,
      })
      .onConflictDoNothing();
  });
}

async function failTask(taskId: string, errorMsg: string) {
  await downloadTaskRepo.update(taskId, {
    status: "failed",
    completedAt: new Date(),
    error: errorMsg,
  });
}
