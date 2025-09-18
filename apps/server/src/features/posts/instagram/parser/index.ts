import type { Instagram } from "@workspace/contracts/instagram/raw";
import z from "zod";
import { type ParsedInstagramPost, ParsedInstagramPostSchema } from "../schemas";
import { postParser } from "./post";

export function parseInstagram(data: string) {
  const jsonData = JSON.parse(data) as Instagram[];

  const parsedPosts = jsonData.flatMap((post) => post.items.map((item) => postParser(item.media)));

  const valid: ParsedInstagramPost[] = [];
  const invalid: ParsedInstagramPost[] = [];

  for (const post of parsedPosts) {
    const result = ParsedInstagramPostSchema.safeParse(post);
    if (result.success) valid.push(post);
    else {
      const pretty = z.prettifyError(result.error);
      console.error(pretty);
      invalid.push(post);
    }
  }

  return { valid: valid, invalid: invalid };
}
