import type { Media } from "@/contracts/raw/instagram";
import { creatorParser } from "./creator";
import { taggedCreatorParser } from "./creator-tag";
import { toDownloadTasks } from "./download-job";
import { postParser } from "./post";
import { itemRelation } from "./relation";
import type { Result } from "./type";

export function instagramParser(post: Media): Result {
  const taggedCreators = taggedCreatorParser(post.usertags);
  const creator = creatorParser(post.owner);
  const postItem = postParser(post);

  const downloadJob = toDownloadTasks(post);

  const taggedRelations = itemRelation(
    postItem,
    taggedCreators.map((t) => ({ x: t.x, y: t.y, externalId: t.creator.externalId })),
    "tagged",
  );

  const createdRelations = itemRelation(postItem, creator, "created_by");

  const items = [...taggedCreators.map((t) => t.creator), creator, postItem];

  return {
    items,
    relations: [...taggedRelations, ...createdRelations],
    downloadJob,
  };
}
