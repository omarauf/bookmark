import type { CreateDownloadTask } from "@workspace/contracts/download-task";
import type { CreateItem } from "@workspace/contracts/item";
import type {
  FluffyUserResults,
  PurpleUserResults,
  StickyUserResults,
} from "@workspace/contracts/raw/twitter";
import { getUsername } from "./common";

type Result = {
  item: CreateItem;
  media: CreateDownloadTask;
};

export function creatorParser(
  creator: FluffyUserResults | PurpleUserResults | StickyUserResults | undefined,
): Result {
  if (!creator) {
    throw new Error("Invalid creator result");
  }
  const externalId = creator.result.id;
  const username = getUsername(creator);
  const name = creator.result.core.name;
  const createdAt = new Date(creator.result.core.created_at);
  const url = `https://x.com/${username}`;
  const verified = creator.result.is_blue_verified;
  const location = creator.result.location.location || undefined;

  if (creator.result.avatar.image_url === undefined) {
    throw new Error("Creator avatar URL is undefined");
  }

  return {
    item: {
      externalId,
      platform: "twitter",
      kind: "profile",
      url,
      caption: undefined, // TODO: can we get the bio/description of the creator?
      createdAt,
      metadata: {
        platform: "twitter",
        kind: "profile",
        username,
        name,
        verified,
        location,
      },
    },
    media: {
      externalId: externalId,
      url: creator.result.avatar.image_url,
      platform: "twitter",
      key: `twitter/avatar/${externalId}.jpg`,
      type: "image",
    },
  };
}
