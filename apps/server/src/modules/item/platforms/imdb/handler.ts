import type { Platform } from "@workspace/contracts/platform";
import type { ScrapePayload } from "@workspace/contracts/scrape";
import type { PlatformHandler } from "@/core/platform";

export class ImdbHandler implements PlatformHandler {
  platform: Platform = "imdb";

  validate(): { valid: number; invalid: number } {
    throw new Error("IMDB scrape is not implemented yet");
  }

  parse(): ScrapePayload {
    throw new Error("IMDB scrape is not implemented yet");
  }
}
