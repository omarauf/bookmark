import type { CreateJob, Job, LogLevel } from "@workspace/contracts/job";
import { and, asc, eq, inArray, lte, or } from "drizzle-orm";
import { db } from "@/core/db";
import { replaceNullWithUndefined } from "@/utils/object";
import { jobLogs, jobs } from "./schema";

export async function createSingleJob(newJob: CreateJob) {
  const [job] = await db
    .insert(jobs)
    .values({ ...newJob, createdAt: new Date() })
    .returning();

  return job;
}

export async function claimJobs(batchSize: number) {
  const now = new Date();

  const jobToClaim = db
    .select({ id: jobs.id })
    .from(jobs)
    .where(or(eq(jobs.status, "pending"), and(eq(jobs.status, "retrying"), lte(jobs.retryAt, now))))
    .orderBy(asc(jobs.createdAt))
    .limit(batchSize)
    .for("update", { skipLocked: true });

  const claimed = await db
    .update(jobs)
    .set({ status: "processing", startedAt: now })
    .where(inArray(jobs.id, jobToClaim))
    .returning();

  return replaceNullWithUndefined(claimed);
}

export async function completeJob(jobId: string, startedAt: Date) {
  const [job] = await db
    .update(jobs)
    .set({ status: "completed", completedAt: new Date(), progress: 100 })
    .where(and(eq(jobs.id, jobId), eq(jobs.status, "processing"), eq(jobs.startedAt, startedAt)))
    .returning();

  return replaceNullWithUndefined(job);
}

export async function failClaimedJob(
  job: Job,
  startedAt: Date,
  error: string,
  errorDetail?: string,
) {
  const nextAttemptCount = job.attemptCount + 1;
  const now = new Date();
  const hasRetriesLeft = nextAttemptCount < job.maxAttempts;

  const retryDelayMs = hasRetriesLeft ? 3 ** (nextAttemptCount - 1) * 5 * 60 * 1000 : null;
  const retryAt = retryDelayMs ? new Date(Date.now() + retryDelayMs) : null;
  const nextStatus = hasRetriesLeft ? "retrying" : "failed";

  const [updated] = await db
    .update(jobs)
    .set({
      status: nextStatus,
      attemptCount: nextAttemptCount,
      retryAt,
      error,
      errorDetail: errorDetail ?? null,
      failedAt: now,
    })
    .where(and(eq(jobs.id, job.id), eq(jobs.status, "processing"), eq(jobs.startedAt, startedAt)))
    .returning();

  return replaceNullWithUndefined(updated);
}

export async function log(
  jobId: string,
  level: LogLevel,
  message: string,
  metadata?: Record<string, unknown>,
) {
  const [log] = await db.insert(jobLogs).values({ jobId, level, message, metadata }).returning();
  return log;
}
