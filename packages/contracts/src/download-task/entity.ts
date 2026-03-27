import z from "zod";
import { PlatformEnum } from "../common/platform";
import { MediaTypeEnum, ReferenceTypeEnum } from "../media/enum";

// const DownloadTaskSchema = z.object({
//   id: z.uuid(),
//   url: z.string(),
//   type: MediaTypeEnum,
//   platform: PlatformEnum,
//   status: DownloadStatusEnum,
//   target: ReferenceTypeEnum,
//   error: z.string().optional(),
//   externalId: z.string(),
//   createdAt: z.date(),
//   startedAt: z.date().optional(),
//   completedAt: z.date().optional(),
// });

export const CreateDownloadTaskSchema = z.object({
  url: z.string(),

  type: MediaTypeEnum,
  externalId: z.string(),
  key: z.string(),
  platform: PlatformEnum,
  referenceType: ReferenceTypeEnum,

  size: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
});

export type CreateDownloadTask = z.infer<typeof CreateDownloadTaskSchema>;
