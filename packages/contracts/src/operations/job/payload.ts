import { z } from "zod";
import { MediaTypeEnum } from "../../core/media/enum";
import { PlatformEnum } from "../../foundation/platform";

const DownloadMediaPayloadSchema = z.object({
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

const IngestUploadPayloadSchema = z.object({
  tempFilePath: z.string(),
  filename: z.string(),
  platform: PlatformEnum,
  scrapedAt: z.coerce.date(),
  size: z.number(),
});

const IngestProcessPayloadSchema = z.object({
  ingestId: z.string(),
});

const ImdbDiscoverPayloadSchema = z.object({});

const ImdbFetchPayloadSchema = z.object({
  linkId: z.string(),
  imdbId: z.string(),
});

const AnimeDiscoverPayloadSchema = z.object({});

const AnimeFetchPayloadSchema = z.object({
  linkId: z.string(),
  animeId: z.string(),
});

const YoutubeDiscoverPayloadSchema = z.object({});

const YoutubeFetchPayloadSchema = z.object({
  linkId: z.string(),
  videoId: z.string(),
});

const YoutubeDownloadPayloadSchema = z.object({
  itemId: z.string(),
  formatId: z.string(),
  url: z.string(),
  ext: z.string(),
  needsMerge: z.boolean().optional(),
});

export const JobPayloadSchemas = {
  downloadMedia: DownloadMediaPayloadSchema,
  ingestUpload: IngestUploadPayloadSchema,
  ingestProcess: IngestProcessPayloadSchema,
  imdbDiscover: ImdbDiscoverPayloadSchema,
  imdbFetch: ImdbFetchPayloadSchema,
  animeDiscover: AnimeDiscoverPayloadSchema,
  animeFetch: AnimeFetchPayloadSchema,
  youtubeDiscover: YoutubeDiscoverPayloadSchema,
  youtubeFetch: YoutubeFetchPayloadSchema,
  youtubeDownload: YoutubeDownloadPayloadSchema,
};

export const JobPayloadSchema = z.union([
  DownloadMediaPayloadSchema,
  IngestUploadPayloadSchema,
  IngestProcessPayloadSchema,
  ImdbDiscoverPayloadSchema,
  ImdbFetchPayloadSchema,
  AnimeDiscoverPayloadSchema,
  AnimeFetchPayloadSchema,
  YoutubeDiscoverPayloadSchema,
  YoutubeFetchPayloadSchema,
  YoutubeDownloadPayloadSchema,
]);
