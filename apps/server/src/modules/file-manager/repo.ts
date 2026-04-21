import { db } from "@/core/db";
import { MiniRepository } from "@/core/db/repos/mini";
import { files, folders } from "./schema";

export const fileRepo = new MiniRepository(db, files, files.id);
export const folderRepo = new MiniRepository(db, folders, folders.id);
