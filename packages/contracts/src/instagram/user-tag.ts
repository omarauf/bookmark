import { z } from "zod";
import { InstagramUserSchema } from "./user";

export const InstagramUserTagSchema = z.object({
  x: z.number(),
  y: z.number(),
  user: InstagramUserSchema,
});

export type InstagramUserTag = z.infer<typeof InstagramUserTagSchema>;
