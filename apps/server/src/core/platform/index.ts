import type { ImportPayload } from "@workspace/contracts/import";
import type { Platform } from "@workspace/contracts/platform";

export interface PlatformHandler {
  platform: Platform;

  validate(data: string): { valid: number; invalid: number };

  handler(data: string): ImportPayload;
}
