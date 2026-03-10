import type { PlatformType } from "@workspace/contracts/platform-type";
import { downloadInstagram } from "../instagram/downloader";
import type { ParsedInstagramPost } from "../instagram/schemas";
import { downloadTiktok } from "../tiktok/downloader";
import type { ParsedTiktokPost } from "../tiktok/schemas";
import { downloadTwitter } from "../twitter/downloader";
import type { ParsedTwitterPost } from "../twitter/schemas";

type PlatformDataMap = {
  instagram: ParsedInstagramPost;
  twitter: ParsedTwitterPost;
  tiktok: ParsedTiktokPost;
};

type PlatformDownloaderMap = {
  [K in PlatformType]: (data: PlatformDataMap[K]) => Promise<boolean>;
};

const downloader: PlatformDownloaderMap = {
  instagram: downloadInstagram,
  twitter: downloadTwitter,
  tiktok: downloadTiktok,
};

export function postDownloader<T extends PlatformType>(type: T, data: PlatformDataMap[T]) {
  return downloader[type](data as PlatformDataMap[T]);
}
