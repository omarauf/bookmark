import type { Platform } from "@/contracts/common";
import type { ImportItem } from "@/contracts/item";

export interface PlatformHandler {
  platform: Platform;

  validate(data: string): { valid: number; invalid: number };

  handler(data: string): ImportItem;
}
