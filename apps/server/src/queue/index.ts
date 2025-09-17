import { Queue } from "bullmq";
import { connectRedis } from "@/services/cache/redis";

export const QUEUE = {
  default: "default",
  downloader: "downloader",
};

let downloaderQueue: Queue<{ id: string }> | null = null;

export function getDownloaderQueue() {
  if (downloaderQueue) return downloaderQueue;

  const connection = connectRedis();

  downloaderQueue = new Queue(QUEUE.downloader, {
    connection,
    defaultJobOptions: {
      removeOnComplete: {
        count: 1000, // keep up to 1000 jobs
        age: 24 * 3600, // keep up to 24 hours
      },
      removeOnFail: {
        age: 24 * 3600, // keep up to 24 hours
      },
    },
  });

  return downloaderQueue;
}
