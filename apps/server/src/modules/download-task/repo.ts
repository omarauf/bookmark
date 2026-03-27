import { db } from "@/core/db";
import { MiniRepository } from "@/core/db/repos/mini";
import { downloadTasks } from "./schema";

export const downloadTaskRepo = new MiniRepository(db, downloadTasks, downloadTasks.id);
