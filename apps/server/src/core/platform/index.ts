import type { ItemImport } from "@workspace/contracts/item";
import type { Platform } from "@workspace/contracts/platform";

export interface PlatformHandler {
  platform: Platform;

  validate(data: string): { valid: number; invalid: number };

  handler(data: string): ItemImport;
}
