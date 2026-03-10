import type { PlatformType } from "@workspace/contracts/platform-type";
import { mapInstagram } from "../instagram/mapper";
import type { ParsedInstagramPost } from "../instagram/schemas";
import { mapTiktok } from "../tiktok/mapper";
import type { ParsedTiktokPost } from "../tiktok/schemas";
import { mapTwitter } from "../twitter/mapper";
import type { ParsedTwitterPost } from "../twitter/schemas";

type PlatformDataMap = {
  instagram: ParsedInstagramPost;
  twitter: ParsedTwitterPost;
  tiktok: ParsedTiktokPost;
};

type PlatformDownloaderMap = {
  [K in PlatformType]: (data: PlatformDataMap[K][]) => Promise<{
    mappedUsers: number;
    mappedPosts: number;
  }>;
};

const mappers: PlatformDownloaderMap = {
  twitter: mapTwitter,
  instagram: mapInstagram,
  tiktok: mapTiktok,
};

export function postMapper<T extends PlatformType>(type: T, data: PlatformDataMap[T][]) {
  return mappers[type](data as PlatformDataMap[T][]);
}
