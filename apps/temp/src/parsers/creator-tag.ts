import type { Tags } from "@/contracts/raw/instagram";
import { creatorParser } from "./creator";

export function taggedCreatorParser(creatorTag?: Tags) {
  if (!creatorTag) return [];

  return creatorTag.in.map((t) => {
    if (!t.user) throw new Error("No user found in creator tag");
    if (!t.position) throw new Error("No position found in creator tag");

    return {
      creator: creatorParser(t.user),
      x: t.position[0],
      y: t.position[1],
    };
  });
}
