import type { PlatformType } from "@workspace/contracts/platform-type";
import { downloadInstagram } from "../instagram/downloader";
import type { ParsedInstagramPost } from "../instagram/schemas";
import { downloadTwitter } from "../twitter/downloader";
import type { ParsedTwitterPost } from "../twitter/schemas";

type PlatformDataMap = {
  instagram: ParsedInstagramPost;
  twitter: ParsedTwitterPost;
};

type PlatformDownloaderMap = {
  [K in PlatformType]: (data: PlatformDataMap[K]) => Promise<boolean>;
};

const downloader: PlatformDownloaderMap = {
  instagram: downloadInstagram,
  twitter: downloadTwitter,
};

export function postDownloader<T extends PlatformType>(type: T, data: PlatformDataMap[T]) {
  return downloader[type](data as PlatformDataMap[T]);
}
