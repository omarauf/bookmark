import { db } from "@/core/db";
import { MiniRepository } from "@/core/db/repos/mini";
import { items } from "./schema";

export const itemRepo = new MiniRepository(db, items, items.id);
