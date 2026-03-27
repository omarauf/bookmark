import { z } from "zod";
import { CreateInstagramCreatorSchema } from "./creator";

export const InstagramTaggedCreatorSchema = z.object({
  x: z.number(),
  y: z.number(),
  user: CreateInstagramCreatorSchema,
});
