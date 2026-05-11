import type { Job } from "@workspace/contracts/job";
import { claimJobs, completeJob, failClaimedJob } from "../service";
import { WorkerScheduler } from "../worker-scheduler";
import { processAnimeDiscover } from "./anime/discover";
import { processAnimeFetch } from "./anime/fetch";
import { processImdbDiscover } from "./imdb/discover";
import { processImdbFetch } from "./imdb/fetch";
import { processImportUpload } from "./import/upload";
import { processDownloadMedia } from "./media/download";
import { processImportProcess } from "./post/process";
import { reclaimStaleJobs } from "./reclaimer";
import { processYoutubeDiscover } from "./youtube/discover";
import { processYoutubeDownload } from "./youtube/download";
import { processYoutubeFetch } from "./youtube/fetch";

let scheduler: WorkerScheduler | null = null;

export function startJobSystem(options?: {
  workerCount?: number;
  claimCount?: number;
  claimInterval?: number;
  stalledMinutes?: number;
}) {
  if (scheduler) return;

  const {
    workerCount = 4,
    claimCount = 1,
    claimInterval = 5000,
    stalledMinutes = 60,
  } = options ?? {};

  reclaimStaleJobs(stalledMinutes).catch((error) => {
    console.error("Failed to recover stale jobs on startup:", error);
  });

  scheduler = new WorkerScheduler({
    workerCount,
    interval: claimInterval,
    onTick: async () => {
      const jobBatch = await claimJobs(claimCount);
      for (const job of jobBatch) {
        await processJob(job);
      }
    },
  });

  scheduler.start();
}

export function stopJobSystem() {
  if (scheduler) {
    scheduler.stop();
    scheduler = null;
  }
}

async function processJob(job: Job) {
  if (!job.startedAt) {
    console.error(`Claimed job ${job.id} is missing startedAt`);
    return;
  }

  const startedAt = job.startedAt;

  try {
    switch (job.type) {
      case "import_upload":
        await processImportUpload(job);
        break;
      case "import_process":
        await processImportProcess(job);
        break;
      case "download_media":
        await processDownloadMedia(job);
        break;
      case "imdb_discover":
        await processImdbDiscover(job);
        break;
      case "imdb_fetch":
        await processImdbFetch(job);
        break;
      case "anime_discover":
        await processAnimeDiscover(job);
        break;
      case "anime_fetch":
        await processAnimeFetch(job);
        break;
      case "youtube_discover":
        await processYoutubeDiscover(job);
        break;
      case "youtube_fetch":
        await processYoutubeFetch(job);
        break;
      case "youtube_download":
        await processYoutubeDownload(job);
        break;
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }

    await completeJob(job.id, startedAt);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const detail = error instanceof Error ? error.stack : undefined;
    await failClaimedJob(job, startedAt, message, detail);
  }
}
