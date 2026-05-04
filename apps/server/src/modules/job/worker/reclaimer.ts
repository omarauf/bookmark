import { and, eq, lte } from "drizzle-orm";
import { db } from "@/core/db";
import { jobs } from "../schema";

const STALLED_ERROR = "Job stalled and was returned to the queue";
const EXCEEDED_ERROR = "Job stalled and exceeded max attempts";
const RETRY_DELAY_MS = 5 * 60 * 1000;

export async function reclaimStaleJobs(stalledMinutes = 60) {
  const cutoff = new Date(Date.now() - stalledMinutes * 60000);

  const stale = await db
    .select({
      id: jobs.id,
      startedAt: jobs.startedAt,
      attemptCount: jobs.attemptCount,
      maxAttempts: jobs.maxAttempts,
    })
    .from(jobs)
    .where(and(eq(jobs.status, "processing"), lte(jobs.startedAt, cutoff)));

  let reclaimedCount = 0;

  for (const job of stale) {
    if (!job.startedAt) continue;

    const nextAttempt = job.attemptCount + 1;
    const hasRetriesLeft = nextAttempt < job.maxAttempts;

    const nextStatus = hasRetriesLeft ? "retrying" : "failed";
    const errorMessage = hasRetriesLeft ? STALLED_ERROR : EXCEEDED_ERROR;
    const retryAt = hasRetriesLeft ? new Date(Date.now() + RETRY_DELAY_MS) : null;

    const [updated] = await db
      .update(jobs)
      .set({
        status: nextStatus,
        attemptCount: nextAttempt,
        retryAt,
        error: errorMessage,
        failedAt: new Date(),
        startedAt: null,
      })
      .where(
        and(eq(jobs.id, job.id), eq(jobs.status, "processing"), eq(jobs.startedAt, job.startedAt)),
      )
      .returning({ id: jobs.id });

    if (updated) {
      reclaimedCount++;
    }
  }

  return reclaimedCount;
}
