import type { IngestPayload } from "@workspace/contracts/ingest";
import type { Platform } from "@workspace/contracts/platform";

export interface PlatformHandler {
  platform: Platform;

  validate(data: string): { valid: number; invalid: number };

  parse(data: string): IngestPayload;
}
