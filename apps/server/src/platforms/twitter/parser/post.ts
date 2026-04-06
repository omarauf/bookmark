import type { CreateDownloadTask } from "@workspace/contracts/download-task";
import type { CreateItem } from "@workspace/contracts/item";
import type {
  CunningResult,
  FluffyTweet,
  TweetResultsResult,
} from "@workspace/contracts/raw/twitter";
import { getUsername } from "./common";
import { mediaParser } from "./media";

type Result = {
  item: CreateItem;
  media: CreateDownloadTask[];
};

export function postParser(tweet: TweetResultsResult | FluffyTweet | CunningResult): Result {
  if (tweet.core === undefined || tweet.legacy === undefined || tweet.rest_id === undefined) {
    throw new Error("Invalid tweet result");
  }

  const postId = tweet.rest_id;
  const username = getUsername(tweet.core.user_results);
  const url = `https://x.com/${username}/status/${postId}`;
  const createdAt = new Date(tweet.legacy.created_at);

  return {
    item: {
      externalId: postId,
      url,
      createdAt,
      kind: "post",
      platform: "twitter",
      caption: tweet.legacy.full_text.replace(/https:\/\/t\.co\/\S+/g, ""),
      metadata: {
        kind: "post",
        platform: "twitter",
        videoDescription: tweet.post_video_description,
        imageDescription: tweet.post_image_description,
        views: Number(tweet.views?.count || 0),
        likes: Number(tweet.legacy.favorite_count || 0),
        quotes: Number(tweet.legacy.quote_count || 0),
        replies: Number(tweet.legacy.reply_count || 0),
        retweets: Number(tweet.legacy.retweet_count || 0),
        bookmarks: Number(tweet.legacy.bookmark_count || 0),
      },
    },
    media: mediaParser(postId, tweet.legacy.extended_entities?.media || []),
  };
}
