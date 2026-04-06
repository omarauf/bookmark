import z from "zod";
import { PlatformEnum } from "../common/platform";
import { MediaTypeEnum } from "../media/enum";
import { DownloadStatusEnum } from "./enum";

export const DownloadTaskSchema = z.object({
  id: z.uuid(),
  createdAt: z.date(),

  url: z.string(),
  type: MediaTypeEnum,
  platform: PlatformEnum,
  status: DownloadStatusEnum,
  error: z.string().nullable(),
  externalId: z.string(),
  completedAt: z.date().nullable(),
  key: z.string(),

  size: z.number().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  duration: z.number().nullable(),
});

export const CreateDownloadTaskSchema = z.object({
  url: z.string(),

  type: MediaTypeEnum,
  externalId: z.string(),
  key: z.string(),
  platform: PlatformEnum,

  size: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
});

export type DownloadTask = z.infer<typeof DownloadTaskSchema>;
export type CreateDownloadTask = z.infer<typeof CreateDownloadTaskSchema>;
