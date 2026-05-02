import { z } from "zod";
import { MediaTypeEnum } from "../../core/media/enum";
import { PlatformEnum } from "../../foundation/platform";

export const DownloadMediaPayloadSchema = z.object({
  url: z.string(),
  type: MediaTypeEnum,
  platform: PlatformEnum,
  externalId: z.string(),
  key: z.string(),
  size: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
});

export const ImportUploadPayloadSchema = z.object({
  tempFilePath: z.string(),
  filename: z.string(),
  platform: PlatformEnum,
  scrapedAt: z.coerce.date(),
  size: z.number(),
});

export const ImportProcessPayloadSchema = z.object({
  importId: z.string(),
});
