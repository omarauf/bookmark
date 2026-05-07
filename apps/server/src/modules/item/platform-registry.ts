import type { Platform } from "@workspace/contracts/platform";
import type { PlatformHandler } from "@/core/platform";
import { ChromeHandler } from "@/modules/item/platforms/chrome/handler";
import { ImdbHandler } from "@/modules/item/platforms/imdb/handler";
import { InstagramHandler } from "@/modules/item/platforms/instagram/handler";
import { TiktokHandler } from "@/modules/item/platforms/tiktok/handler";
import { TwitterHandler } from "@/modules/item/platforms/twitter/handler";

const handlers: Record<Platform, PlatformHandler> = {
  chrome: new ChromeHandler(),
  imdb: new ImdbHandler(), // TODO: Replace with placeholder handler
  mal: new ImdbHandler(), // TODO: Replace with placeholder handler
  youtube: new ImdbHandler(), // TODO: Replace with placeholder handler
  instagram: new InstagramHandler(),
  tiktok: new TiktokHandler(),
  twitter: new TwitterHandler(),
};

function getHandler(platform: Platform): PlatformHandler {
  const handler = handlers[platform];
  if (!handler) throw new Error(`Unsupported platform: ${platform}`);
  return handler;
}

export function validateImport(platform: Platform, data: string) {
  return getHandler(platform).validate(data);
}

export function parseImport(platform: Platform, data: string) {
  return getHandler(platform).parse(data);
}
