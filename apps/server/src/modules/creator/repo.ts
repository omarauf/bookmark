import { db } from "@/core/db";
import { MiniRepository } from "@/core/db/repos/mini";
import { creators } from "./schema";

export const creatorRepo = new MiniRepository(db, creators, creators.id);
