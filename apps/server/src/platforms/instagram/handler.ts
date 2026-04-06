import { type ItemImport, ItemSchemas } from "@workspace/contracts/item";
import type { Platform } from "@workspace/contracts/platform";
import type { Instagram, Media } from "@workspace/contracts/raw/instagram";
import type { PlatformHandler } from "@/core/platform";
import { jsonParse } from "@/utils/object";
import { relation } from "../common/relation";
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

  handler(data: string): ItemImport {
    const jsonData = jsonParse<Instagram[]>(data);

    if (jsonData === undefined) {
      return { items: [], relations: [], downloadTasks: [] };
    }

    const results = jsonData
      .flatMap((post) => post.items)
      .flatMap((item) => item.media)
      .map((media) => this._handler(media))
      .filter(Boolean) as ItemImport[];

    return {
      items: results.flatMap((r) => r.items),
      relations: results.flatMap((r) => r.relations),
      downloadTasks: results.flatMap((r) => r.downloadTasks),
    };
  }

  private _handler(post: Media): ItemImport | undefined {
    if (!post) return undefined;

    const taggedCreators = taggedCreatorParser(post.usertags);
    const creator = creatorParser(post.owner);
    const postItem = postParser(post);

    const downloadTask = toDownloadTasks(post);

    const taggedRelations = relation(
      postItem,
      taggedCreators.map((t) => ({
        x: t.x,
        y: t.y,
        externalId: t.creator.externalId,
      })),
      "tagged",
    );

    const createdRelations = relation(postItem, creator, "created_by");

    const items = [postItem, creator, ...taggedCreators.map((t) => t.creator)];
    const relations = [...taggedRelations, ...createdRelations];

    const itemImport = { items, relations, downloadTask };

    const result = ItemSchemas.import.safeParse(itemImport);
    if (!result.success) {
      console.warn("Invalid import item:", result.error);
      return undefined;
    }

    return result.data;
  }
}
