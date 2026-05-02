import { type ImportPayload, ImportPayloadSchema } from "@workspace/contracts/import";
import type { CreateItem } from "@workspace/contracts/item";
import type { DownloadMediaPayload } from "@workspace/contracts/job";
import type { Platform } from "@workspace/contracts/platform";
import type { TweetResults, Twitter } from "@workspace/contracts/raw/twitter";
import type { CreateRelation } from "@workspace/contracts/relation";
import type { PlatformHandler } from "@/core/platform";
import { jsonParse } from "@/utils/object";
import { relation } from "../common/relation";
import { getCreator, getTweet } from "./parser/common";
import { creatorParser } from "./parser/creator";
import { postParser } from "./parser/post";

export class TwitterHandler implements PlatformHandler {
  platform: Platform = "twitter";

  validate(data: string): { valid: number; invalid: number } {
    const jsonData = jsonParse<Twitter[]>(data) || [];

    let valid = 0;
    let invalid = 0;

    for (const post of jsonData) {
      for (const item of post.data.bookmark_timeline_v2.timeline.instructions) {
        for (const entry of item.entries) {
          if (entry.content.itemContent?.tweet_results === undefined) {
            invalid++;
            continue;
          }
          const parsed = this._handler(entry.content.itemContent?.tweet_results);
          if (parsed) valid++;
          else invalid++;
        }
      }
    }

    return { valid, invalid };
  }

  handler(data: string): ImportPayload {
    const jsonData = jsonParse<Twitter[]>(data);

    if (jsonData === undefined) {
      return { items: [], invalidItems: [], relations: [], downloadTasks: [] };
    }

    const results = jsonData
      .flatMap((post) => post.data.bookmark_timeline_v2.timeline.instructions)
      .flatMap((item) => item.entries)
      .map((entry) => entry.content.itemContent?.tweet_results)
      .map((tweet) => this._handler(tweet))
      .filter(Boolean) as ImportPayload[];

    return {
      items: results.flatMap((r) => r.items),
      invalidItems: results.flatMap((r) => r.invalidItems),
      relations: results.flatMap((r) => r.relations),
      downloadTasks: results.flatMap((r) => r.downloadTasks),
    };
  }

  private _handler(data: TweetResults | undefined): ImportPayload | undefined {
    if (!data) return { items: [], invalidItems: [data], relations: [], downloadTasks: [] };

    const tweet = postParser(getTweet(data));
    const creator = creatorParser(getCreator(data));
    const createdRelations = relation(tweet.item, creator.item, "created_by");

    const items: CreateItem[] = [tweet.item, creator.item];
    const relations: CreateRelation[] = [...createdRelations];
    const downloadTasks: DownloadMediaPayload[] = [...tweet.media, creator.media];

    const quotedItem = this.getQuotedTweet(data);
    if (quotedItem) {
      const { quotedTweet, quotedCreator } = quotedItem;
      const quotedRelations = relation(tweet.item, quotedTweet.item, "quoted");
      const creatorRelations = relation(quotedTweet.item, quotedCreator.item, "created_by");

      items.push(quotedTweet.item, quotedCreator.item);
      relations.push(...quotedRelations, ...creatorRelations);
      downloadTasks.push(...quotedTweet.media, quotedCreator.media);
    }

    const payload = { items, invalidItems: [], relations, downloadTasks };

    const result = ImportPayloadSchema.safeParse(payload);
    if (!result.success) {
      return { items: [], invalidItems: [data], relations: [], downloadTasks: [] };
    }

    return result.data;
  }

  private getQuotedTweet(tweet: TweetResults) {
    if (tweet.result?.quoted_status_result?.result) {
      const q = tweet.result.quoted_status_result.result;
      if (q.tombstone === undefined) {
        const quotedTweet = postParser(q);
        const quotedCreator = creatorParser(q.core?.user_results);

        return { quotedTweet, quotedCreator };
      }
    }

    return undefined;
  }
}
