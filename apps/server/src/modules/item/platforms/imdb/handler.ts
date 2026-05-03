import type { ImportPayload } from "@workspace/contracts/import";
import type { Platform } from "@workspace/contracts/platform";
import type { PlatformHandler } from "@/core/platform";

export class ImdbHandler implements PlatformHandler {
  platform: Platform = "imdb";

  validate(): { valid: number; invalid: number } {
    throw new Error("IMDB import is not implemented yet");
  }

  parse(): ImportPayload {
    throw new Error("IMDB import is not implemented yet");
  }
}
