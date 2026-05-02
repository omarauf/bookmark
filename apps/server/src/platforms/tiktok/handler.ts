import { type ImportPayload, ImportPayloadSchema } from "@workspace/contracts/import";
import type { Platform } from "@workspace/contracts/platform";
import type { ItemList, Tiktok } from "@workspace/contracts/raw/tiktok";
import type { PlatformHandler } from "@/core/platform";
import { jsonParse } from "@/utils/object";
import { relation } from "../common/relation";
import { toDownloadTasks } from "./download-job";
import { creatorParser } from "./parser/creator";
import { postParser } from "./parser/post";

export class TiktokHandler implements PlatformHandler {
  platform: Platform = "tiktok";

  validate(data: string): { valid: number; invalid: number } {
    const jsonData = jsonParse<Tiktok[]>(data) || [];

    let valid = 0;
    let invalid = 0;

    for (const post of jsonData) {
      for (const item of post.itemList ?? []) {
        const parsed = this._handler(item);
        if (parsed) valid++;
        else invalid++;
      }
    }

    return { valid, invalid };
  }

  handler(data: string): ImportPayload {
    const jsonData = jsonParse<Tiktok[]>(data);

    if (jsonData === undefined) {
      return { items: [], invalidItems: [], relations: [], downloadTasks: [] };
    }

    const results = jsonData
      .flatMap((post) => post.itemList ?? [])
      .map((post) => this._handler(post))
      .filter(Boolean) as ImportPayload[];

    return {
      items: results.flatMap((r) => r.items),
      invalidItems: results.flatMap((r) => r.invalidItems),
      relations: results.flatMap((r) => r.relations),
      downloadTasks: results.flatMap((r) => r.downloadTasks),
    };
  }

  private _handler(post: ItemList): ImportPayload | undefined {
    if (!post) return { items: [], invalidItems: [post], relations: [], downloadTasks: [] };

    const creator = creatorParser(post.author);
    const postItem = postParser(post);

    const downloadTasks = toDownloadTasks(post);

    const createdRelations = relation(postItem, creator, "created_by");

    const items = [postItem, creator];
    const relations = createdRelations;

    const payload = { items, invalidItems: [], relations, downloadTasks };

    const result = ImportPayloadSchema.safeParse(payload);
    if (!result.success) {
      return { items: [], invalidItems: [post], relations: [], downloadTasks: [] };
    }

    return result.data;
  }
}
