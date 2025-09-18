import { Worker } from "bullmq";
import pLimit from "p-limit";
import ProgressBar from "progress";
import { fileManager } from "@/features/file-manager/service";
import { ImportModel } from "@/features/import/model";
import { QUEUE } from "@/queue";
import { connectRedis } from "@/services/cache/redis";
import { postDownloader } from "./downloader";
import { models } from "./model";
import { parsers } from "./parser";

const connection = connectRedis();

const worker = new Worker<{ id: string }>(
  QUEUE.downloader,
  async (job) => {
    console.log(
      `Processing downloader job ${job.id}: Preparing to download posts for import ID ${job.data.id}...`,
    );

    const data = await ImportModel.findById(job.data.id);
    if (!data) throw new Error(`Import with id ${job.data.id} not found`);

    const filenameNoExtension = data.name.split(".").slice(0, -1).join(".");
    const fileContent = await fileManager.readFileAsString(`json/${filenameNoExtension}.json`);

    const post = parsers[data.type](fileContent);

    const limit = pLimit(12);
    const bar = new ProgressBar(":current/:total [:bar] :percent", {
      total: post.valid.length,
      width: 40,
      complete: "=",
      incomplete: " ",
    });

    const downloadIds: string[] = [];

    const promises = post.valid.map((post) =>
      limit(async () => {
        const success = await postDownloader(data.type, post);
        if (success) downloadIds.push(post.postId);
        bar.tick();
      }),
    );

    await Promise.all(promises);

    console.log("All posts downloaded successfully.");

    const downloadDate = new Date();

    const model = models[data.type];

    await model.updateMany(
      { postId: { $in: downloadIds }, downloadedAt: null },
      { $set: { downloadedAt: downloadDate } },
    );

    return { status: "done", input: job.data };
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed, task name: ${job.name}`);
});

worker.on("failed", (job, error) => {
  if (job) {
    console.error(`Job ${job.id} failed, task name: ${job.name}, error: ${error.message}`);
  } else {
    console.error(`Job failed, error: ${error.message}`);
  }
});

worker.on("error", (err) => {
  console.error(err);
});

export function checkWorkerStatus() {
  if (worker.isRunning()) {
    console.log("✅ Worker is running");
  } else {
    console.log("❌ Worker is not running");
  }
}
