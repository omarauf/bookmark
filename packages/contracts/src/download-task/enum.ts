import z from "zod";

export const DownloadStatusEnum = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
  "exists",
]);
export type DownloadStatus = z.infer<typeof DownloadStatusEnum>;
export const DownloadStatusValues = DownloadStatusEnum.options as [
  DownloadStatus,
  ...DownloadStatus[],
];
