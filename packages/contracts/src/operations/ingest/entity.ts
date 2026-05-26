import { z } from "zod";
import { PlatformEnum } from "../../foundation/platform";

export const IngestSchema = z.object({
  id: z.uuid(),
  filename: z.string(),
  platform: PlatformEnum,
  size: z.number(),
  validPost: z.number(),
  invalidPost: z.number(),

  ingestedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  scrapedAt: z.date(),
});
