import { db } from "@/core/db";
import { MiniRepository } from "@/core/db/repos/mini";
import { ingests } from "./schema";

export const ingestRepo = new MiniRepository(db, ingests, ingests.id);
