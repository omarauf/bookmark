import z from "zod";
import { PlatformEnum } from "../common/platform";

export const ImportSchema = z.object({
  id: z.uuid(),
  filename: z.string(),
  platform: PlatformEnum,
  size: z.number(),
  validItem: z.number(),
  invalidItem: z.number(),

  importedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  scrapedAt: z.date(),
});
