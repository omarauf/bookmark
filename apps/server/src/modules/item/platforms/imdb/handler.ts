import type { IngestPayload } from "@workspace/contracts/ingest";
import type { Platform } from "@workspace/contracts/platform";
import type { PlatformHandler } from "@/core/platform";

export class ImdbHandler implements PlatformHandler {
  platform: Platform = "imdb";

  validate(): { valid: number; invalid: number } {
    throw new Error("IMDB ingest is not implemented yet");
  }

  parse(): IngestPayload {
    throw new Error("IMDB ingest is not implemented yet");
  }
}
