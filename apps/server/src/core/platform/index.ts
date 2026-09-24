import type { Platform } from "@workspace/contracts/platform";
import type { ScrapePayload } from "@workspace/contracts/scrape";

export interface PlatformHandler {
  platform: Platform;

  validate(data: string): { valid: number; invalid: number };

  parse(data: string): ScrapePayload;
}
