import { type IngestPayload, IngestPayloadSchema } from "@workspace/contracts/ingest";
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
            continue;
          }
          const parsed = this._parse(entry.content.itemContent?.tweet_results);
          if (parsed) valid++;
          else invalid++;
        }
      }
    }

    return { valid, invalid };
  }

  parse(data: string): IngestPayload {
    const jsonData = jsonParse<Twitter[]>(data);

    if (jsonData === undefined) {
      return { items: [], invalidItems: [], relations: [], downloadTasks: [] };
    }

    const entries = jsonData
      .flatMap((post) => post.data.bookmark_timeline_v2.timeline.instructions)
      .flatMap((item) => item.entries);

    const results: IngestPayload[] = [];

    for (const entry of entries) {
      if (entry.content.itemContent?.tweet_results === undefined) {
        results.push({ items: [], invalidItems: [entry], relations: [], downloadTasks: [] });
        continue;
      }
      const parsed = this._parse(entry.content.itemContent?.tweet_results);
      results.push(parsed);
    }

    return {
      items: results.flatMap((r) => r.items),
      invalidItems: results.flatMap((r) => r.invalidItems),
      relations: results.flatMap((r) => r.relations),
      downloadTasks: results.flatMap((r) => r.downloadTasks),
    };
  }

  private _parse(data: TweetResults): IngestPayload {
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

    const result = IngestPayloadSchema.safeParse(payload);
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
