import { db } from "@/core/db";
import { MiniRepository } from "@/core/db/repos/mini";
import { posts } from "./schema";

export const postRepo = new MiniRepository(db, posts, posts.id);
