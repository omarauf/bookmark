import { db } from "@/core/db";
import { MiniRepository } from "@/core/db/repos/mini";
import { collections } from "./schema";

export const collectionRepo = new MiniRepository(db, collections, collections.id);
