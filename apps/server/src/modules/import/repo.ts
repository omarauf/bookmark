import { db } from "@/core/db";
import { MiniRepository } from "@/core/db/repos/mini";
import { imports } from "./schema";

export const importRepo = new MiniRepository(db, imports, imports.id);
