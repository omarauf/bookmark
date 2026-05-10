import { JobSchemas, type JobType } from "@workspace/contracts/job";
import { and, asc, count, desc, eq, gte, inArray, isNotNull, sql } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { jobGroups, jobs } from "../schema";

export const analyticsHandler = protectedProcedure
  .input(JobSchemas.analytics.request)
  .output(JobSchemas.analytics.response)
  .handler(async ({ input }) => {
    const days = input?.days ?? 30;
    const types = input?.types;

    const jobsByDay = await getJobLastNDays(days, types);

    const durationByType = await getDurationByType(types);

    const attemptDistribution = await getAttemptDistribution(types);

    const topErrors = await getTopErrors(types);

    const statusCounts = await getStatusCounts(types);

    const typeCounts = await getTypeCounts(types);

    const groupSizes = await getGroupSizes(types);

    return {
      jobsByDay,
      durationByType,
      attemptDistribution,
      topErrors,
      statusCounts,
      typeCounts,
      groupSizes,
    };
  });

async function getJobLastNDays(days: number, types: JobType[] | undefined) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  // Jobs by day (last N days)
  const dayRows = await db
    .select({
      date: sql<string>`DATE(${jobs.createdAt})`,
      status: jobs.status,
      count: count(),
    })
    .from(jobs)
    .where(and(gte(jobs.createdAt, cutoff), types ? inArray(jobs.type, types) : undefined))
    .groupBy(sql`DATE(${jobs.createdAt})`, jobs.status)
    .orderBy(asc(sql`DATE(${jobs.createdAt})`));

  const dayMap = new Map<string, Map<string, number>>();
  for (const row of dayRows) {
    if (!dayMap.has(row.date)) dayMap.set(row.date, new Map());
    dayMap.get(row.date)?.set(row.status, Number(row.count));
  }

  const jobsByDay = Array.from(dayMap.entries()).map(([date, statusMap]) => ({
    date,
    pending: statusMap.get("pending") ?? 0,
    processing: statusMap.get("processing") ?? 0,
    completed: statusMap.get("completed") ?? 0,
    failed: statusMap.get("failed") ?? 0,
    cancelled: statusMap.get("cancelled") ?? 0,
    retrying: statusMap.get("retrying") ?? 0,
  }));

  return jobsByDay;
}

async function getDurationByType(types: JobType[] | undefined) {
  const rows = await db
    .select({
      type: jobs.type,
      startedAt: jobs.startedAt,
      completedAt: jobs.completedAt,
    })
    .from(jobs)
    .where(
      and(
        sql`${jobs.startedAt} IS NOT NULL`,
        sql`${jobs.completedAt} IS NOT NULL`,
        types ? inArray(jobs.type, types) : undefined,
      ),
    );

  const stats = new Map<string, { totalMs: number; count: number; min: number; max: number }>();

  for (const { type, startedAt, completedAt } of rows) {
    if (!startedAt || !completedAt) continue;

    const duration = new Date(completedAt).getTime() - new Date(startedAt).getTime();

    const current = stats.get(type);

    if (!current) {
      stats.set(type, {
        totalMs: duration,
        count: 1,
        min: duration,
        max: duration,
      });
      continue;
    }

    current.totalMs += duration;
    current.count += 1;
    current.min = Math.min(current.min, duration);
    current.max = Math.max(current.max, duration);
  }

  return Array.from(stats.entries()).map(([type, s]) => ({
    type: type as JobType,
    avgMs: Math.round(s.totalMs / s.count),
    minMs: s.min,
    maxMs: s.max,
    count: s.count,
  }));
}

async function getAttemptDistribution(types: JobType[] | undefined) {
  const attemptRows = await db
    .select({
      attemptCount: jobs.attemptCount,
      count: count(),
    })
    .from(jobs)
    .groupBy(jobs.attemptCount)
    .orderBy(jobs.attemptCount)
    .where(types ? inArray(jobs.type, types) : undefined);

  const attemptDistribution = attemptRows.map((row) => ({
    attempts: row.attemptCount,
    count: Number(row.count),
  }));

  return attemptDistribution;
}

async function getTopErrors(types: JobType[] | undefined) {
  const errorRows = await db
    .select({
      error: jobs.error,
      count: count(),
    })
    .from(jobs)
    .where(and(sql`${jobs.error} IS NOT NULL`, types ? inArray(jobs.type, types) : undefined))
    .groupBy(jobs.error)
    .orderBy(desc(count()))
    .limit(10);

  const topErrors = errorRows.map((row) => ({
    error: row.error ?? "Unknown",
    count: Number(row.count),
  }));

  return topErrors;
}

async function getStatusCounts(types: JobType[] | undefined) {
  const statusRowsAll = await db
    .select({ status: jobs.status, count: count() })
    .from(jobs)
    .groupBy(jobs.status)
    .where(types ? inArray(jobs.type, types) : undefined);

  const statusCounts: Record<string, number> = {};
  for (const row of statusRowsAll) {
    statusCounts[row.status] = Number(row.count);
  }

  return statusCounts;
}

async function getTypeCounts(types: JobType[] | undefined) {
  const typeRowsAll = await db
    .select({ type: jobs.type, count: count() })
    .from(jobs)
    .groupBy(jobs.type)
    .where(types ? inArray(jobs.type, types) : undefined);

  const typeCounts: Record<string, number> = {};
  for (const row of typeRowsAll) {
    typeCounts[row.type] = Number(row.count);
  }

  return typeCounts;
}

async function getGroupSizes(types: JobType[] | undefined) {
  const groupSizeRows = await db
    .select({
      groupId: jobs.groupId,
      name: jobGroups.name,
      count: count(),
    })
    .from(jobs)
    .leftJoin(jobGroups, eq(jobs.groupId, jobGroups.id))
    .where(and(isNotNull(jobs.groupId), types ? inArray(jobs.type, types) : undefined))
    .groupBy(jobs.groupId, jobGroups.name)
    .orderBy(desc(count()))
    .limit(20);

  const groupSizes = groupSizeRows.map((row) => ({
    groupId: row.groupId || "<unknown>",
    name: row.name ?? "Unknown",
    count: Number(row.count),
  }));

  return groupSizes;
}
