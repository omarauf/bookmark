import { db } from "@/core/db";
import { MiniRepository } from "@/core/db/repos/mini";
import { scrapes } from "./schema";

export const scrapeRepo = new MiniRepository(db, scrapes, scrapes.id);
