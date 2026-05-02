import { db } from "@/core/db";
import { MiniRepository } from "@/core/db/repos/mini";
import { jobLogs, jobs } from "./schema";

export const jobRepo = new MiniRepository(db, jobs, jobs.id);
export const jobLogRepo = new MiniRepository(db, jobLogs, jobLogs.id);
