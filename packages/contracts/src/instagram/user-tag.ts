import { z } from "zod";
import { ParsedInstagramUserSchema } from "./user";

export const InstagramUserTagSchema = z.object({
  x: z.number(),
  y: z.number(),
  user: ParsedInstagramUserSchema,
});

export type InstagramUserTag = z.infer<typeof InstagramUserTagSchema>;
