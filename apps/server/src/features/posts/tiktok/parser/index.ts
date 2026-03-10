import type { Tiktok } from "@workspace/contracts/tiktok/raw";
import z from "zod";
import type { ParsedTiktokPost } from "../schemas";
import { ParsedTiktokPostSchema } from "../schemas";
import { postParser } from "./post";

export function parseTiktok(data: string) {
  const jsonData = JSON.parse(data) as Tiktok[];

  const parsedPosts = jsonData.flatMap((page) =>
    (page.itemList ?? []).map((item) => postParser(item)),
  );

  const valid: ParsedTiktokPost[] = [];
  const invalid: ParsedTiktokPost[] = [];

  for (const post of parsedPosts) {
    const result = ParsedTiktokPostSchema.safeParse(post);
    if (result.success) valid.push(post);
    else {
      const pretty = z.prettifyError(result.error);
      console.error(pretty);
      invalid.push(post);
    }
  }

  return { valid: valid, invalid: invalid };
}
