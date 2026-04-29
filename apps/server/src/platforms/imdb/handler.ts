import type { ImportPayload } from "@workspace/contracts/import";
import { type CreateItem, ItemSchemas } from "@workspace/contracts/item";
import type { Platform } from "@workspace/contracts/platform";
import type { PlatformHandler } from "@/core/platform";
import { isImdbId } from "@/modules/imdb/utils";
import { jsonParse } from "@/utils/object";

export class ImdbHandler implements PlatformHandler {
  platform: Platform = "imdb";

  validate(rawData: string): { valid: number; invalid: number } {
    const imdbIds = jsonParse<string[]>(rawData) || [];

    const total = { valid: 0, invalid: 0 };

    for (const imdbId of imdbIds) {
      if (isImdbId(imdbId)) total.valid += 1;
      else total.invalid += 1;
    }

    return total;
  }

  handler(rawData: string): ImportPayload {
    const imdbIds = jsonParse<string[]>(rawData) || [];

    if (!imdbIds.length) {
      return { items: [], relations: [], downloadTasks: [] };
    }

    const { validItems } = this.processBookmarks(imdbIds);

    return {
      items: validItems,
      relations: [],
      downloadTasks: [],
    };
  }

  private processBookmarks(imdbIds: string[]) {
    const collectedItems: CreateItem[] = [];

    for (const _imdbId of imdbIds) {
      // Process each IMDb ID
    }

    const validItems: CreateItem[] = [];
    const invalidItems: CreateItem[] = [];

    for (const item of collectedItems) {
      const parseResult = ItemSchemas.create.safeParse(item);

      if (!parseResult.success) {
        invalidItems.push(item);
      } else {
        validItems.push(parseResult.data);
      }
    }

    return { validItems, invalidItems };
  }
}
