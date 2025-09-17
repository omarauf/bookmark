import type { Twitter } from "@workspace/contracts/twitter/raw";
import z from "zod";
import { postParser } from "./post";
import type { ParsedTwitterPost } from "./schema";
import { ParsedTwitterPostSchema } from "./schema";

export function parseTwitter(data: string) {
  const jsonData = JSON.parse(data) as Twitter[];

  const parsedPosts = jsonData.flatMap((bookmark) =>
    bookmark.data.bookmark_timeline_v2.timeline.instructions.flatMap((instruction) =>
      instruction.entries.flatMap((entry) => {
        if (entry.content.itemContent === undefined) return [];
        if (Object.keys(entry.content.itemContent.tweet_results).length === 0) return [];
        return [postParser(entry.content.itemContent.tweet_results)];
      }),
    ),
  );
  const valid: ParsedTwitterPost[] = [];
  const invalid: ParsedTwitterPost[] = [];

  for (const post of parsedPosts) {
    const result = ParsedTwitterPostSchema.safeParse(post);
    if (result.success) valid.push(post);
    else {
      const pretty = z.prettifyError(result.error);
      console.error(pretty);
      invalid.push(post);
    }
  }

  return { valid: valid, invalid: invalid };
}
