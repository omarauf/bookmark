import type { Platform } from "@/contracts/common";
import { type ImportItem, ImportItemSchema } from "@/contracts/item";
import type { Instagram, Media } from "@/contracts/raw/instagram";
import type { PlatformHandler } from "@/core/platform";
import { jsonParse } from "@/utils/object";
import { itemRelation } from "../common/relation";
import { toDownloadTasks } from "./download-job";
import { creatorParser } from "./parser/creator";
import { postParser } from "./parser/post";
import { taggedCreatorParser } from "./parser/tagged-creator";

export class InstagramHandler implements PlatformHandler {
  platform: Platform = "instagram";

  validate(data: string): { valid: number; invalid: number } {
    const jsonData = jsonParse<Instagram[]>(data) || [];

    let valid = 0;
    let invalid = 0;

    for (const post of jsonData) {
      for (const item of post.items ?? []) {
        const parsed = this._handler(item.media);
        if (parsed) valid++;
        else invalid++;
      }
    }

    return { valid, invalid };
  }

  handler(data: string): ImportItem {
    let jsonData: Instagram[];

    try {
      jsonData = JSON.parse(data) as Instagram[];
    } catch {
      return { items: [], relations: [], downloadJob: [] };
    }

    const results = jsonData
      .flatMap((post) => post.items)
      .flatMap((item) => item.media)
      .map(this._handler)
      .filter(Boolean) as ImportItem[];

    return {
      items: results.flatMap((r) => r.items),
      relations: results.flatMap((r) => r.relations),
      downloadJob: results.flatMap((r) => r.downloadJob),
    };
  }

  private _handler(post: Media): ImportItem | undefined {
    if (!post) return undefined;

    const taggedCreators = taggedCreatorParser(post.usertags);
    const creator = creatorParser(post.owner);
    const postItem = postParser(post);

    const downloadJob = toDownloadTasks(post);

    const taggedRelations = itemRelation(
      postItem,
      taggedCreators.map((t) => ({
        x: t.x,
        y: t.y,
        externalId: t.creator.externalId,
      })),
      "tagged",
    );

    const createdRelations = itemRelation(postItem, creator, "created_by");

    const items = [postItem, creator, ...taggedCreators.map((t) => t.creator)];
    const relations = [...taggedRelations, ...createdRelations];

    const importItem = { items, relations, downloadJob };

    const result = ImportItemSchema.safeParse(importItem);
    if (!result.success) {
      console.warn("Invalid import item:", result.error);
      return undefined;
    }

    return result.data;
  }
}
