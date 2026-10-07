import type { Platform } from "@workspace/contracts/platform";
import { z } from "zod";

const jsonSchema = z.json();
type Json = z.infer<typeof jsonSchema>;

export type ScrapeRow = {
  index: number;
  path: string;
  value: Json;
  externalId: string;
  creator: string;
  text: string;
  searchText: string;
};

function at(value: Json | undefined, ...path: string[]): Json | undefined {
  for (const key of path) {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return undefined;
    value = value[key];
  }
  return value;
}

function firstText(...values: (Json | undefined)[]) {
  const value = values.find((value) => typeof value === "string" || typeof value === "number");
  return value === undefined ? "" : String(value);
}

// Flatten response batches into inspectable records, keeping each raw record and its source path.
export function parseScrapeRows(content: string, platform: Platform): ScrapeRow[] {
  const json = jsonSchema.parse(JSON.parse(content));
  const records: { value: Json; path: string }[] = [];
  const batches = Array.isArray(json) ? json : [json];

  batches.forEach((batch, batchIndex) => {
    const path = Array.isArray(json) ? `$[${batchIndex}]` : "$";
    const items = at(batch, platform === "instagram" ? "items" : "itemList");
    if ((platform === "instagram" || platform === "tiktok") && Array.isArray(items)) {
      items.forEach((value, index) => {
        records.push({
          value,
          path: `${path}.${platform === "instagram" ? "items" : "itemList"}[${index}]`,
        });
      });
      return;
    }

    const instructions = at(batch, "data", "bookmark_timeline_v2", "timeline", "instructions");
    if (platform === "twitter" && Array.isArray(instructions)) {
      instructions.forEach((instruction, instructionIndex) => {
        const entries = at(instruction, "entries");
        if (Array.isArray(entries)) {
          entries.forEach((value, index) => {
            records.push({
              value,
              path: `${path}.data.bookmark_timeline_v2.timeline.instructions[${instructionIndex}].entries[${index}]`,
            });
          });
        } else {
          records.push({
            value: instruction,
            path: `${path}.data.bookmark_timeline_v2.timeline.instructions[${instructionIndex}]`,
          });
        }
      });
      return;
    }

    records.push({ value: batch, path });
  });

  return records.map(({ value, path }, index) => {
    const media = at(value, "media") ?? value;
    const result = at(value, "content", "itemContent", "tweet_results", "result");
    const tweet = at(result, "tweet") ?? result;
    const externalId = firstText(
      at(media, "id"),
      at(media, "pk"),
      at(tweet, "rest_id"),
      at(value, "entryId"),
    );
    const creator = firstText(
      at(media, "owner", "username"),
      at(value, "author", "uniqueId"),
      at(tweet, "core", "user_results", "result", "core", "screen_name"),
      at(tweet, "core", "user_results", "result", "legacy", "screen_name"),
    );
    const text = firstText(
      at(media, "caption", "text"),
      at(value, "desc"),
      at(tweet, "legacy", "full_text"),
      at(value, "title"),
      typeof value === "object" ? undefined : value,
    );
    return {
      index,
      path,
      value,
      externalId,
      creator,
      text,
      searchText: JSON.stringify(value).toLowerCase(),
    };
  });
}
