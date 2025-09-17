import type {
  CunningResult,
  FluffyTweet,
  TweetResults,
  TweetResultsResult,
} from "@workspace/contracts/twitter/raw";
import { mediaParser } from "./media";
import type { ParsedTwitterPost } from "./schema";
import { userParser } from "./user";

export function postParser(post: TweetResults): ParsedTwitterPost {
  let parsedPost: ParsedTwitterPost | undefined;

  if (post?.result?.tweet) {
    parsedPost = tweetParser(post.result.tweet);
  }

  if (post.result?.core) {
    parsedPost = coreParser(post.result);
  }

  if (parsedPost === undefined) {
    throw new Error("Unable to parse tweet");
  }

  if (post.result?.quoted_status_result?.result) {
    const q = post.result.quoted_status_result.result;

    if (q.tombstone === undefined) {
      parsedPost.quoted = coreParser(q);
    }
  }

  return parsedPost;
}

function tweetParser(tweet: FluffyTweet): ParsedTwitterPost {
  const user = userParser(tweet.core.user_results);
  const postId = tweet.rest_id;
  const url = `https://x.com/${user.username}/status/${postId}`;
  const createdAt = new Date(tweet.legacy.created_at);

  const media = tweet.legacy.extended_entities?.media.map(mediaParser) || [];

  return {
    postId,
    url,
    createdAt,
    creator: user,
    caption: tweet.legacy.full_text.replace(/https:\/\/t\.co\/\S+/g, ""),
    media: media,
    videoDescription: tweet.post_video_description,
    imageDescription: tweet.post_image_description,
    views: Number(tweet.views.count || 0),
    likes: Number(tweet.legacy.favorite_count || 0),
    quotes: Number(tweet.legacy.quote_count || 0),
    replies: Number(tweet.legacy.reply_count || 0),
    retweets: Number(tweet.legacy.retweet_count || 0),
    bookmarks: Number(tweet.legacy.bookmark_count || 0),
    quoted: undefined,
  };
}

function coreParser(result: TweetResultsResult | CunningResult): ParsedTwitterPost {
  if (result.core === undefined || result.legacy === undefined || result.rest_id === undefined) {
    throw new Error("Invalid tweet result");
  }

  const user = userParser(result.core.user_results);
  const postId = result.rest_id;
  const url = `https://x.com/${user.username}/status/${postId}`;
  const createdAt = new Date(result.legacy.created_at);

  const media = result.legacy.extended_entities?.media.map(mediaParser) || [];

  return {
    postId,
    url,
    createdAt,
    creator: user,
    caption: result.legacy.full_text.replace(/https:\/\/t\.co\/\S+/g, ""),
    media: media,
    videoDescription: result.post_video_description,
    imageDescription: result.post_image_description,
    views: Number(result.views?.count || 0),
    likes: Number(result.legacy.favorite_count || 0),
    quotes: Number(result.legacy.quote_count || 0),
    replies: Number(result.legacy.reply_count || 0),
    retweets: Number(result.legacy.retweet_count || 0),
    bookmarks: Number(result.legacy.bookmark_count || 0),
    quoted: undefined,
  };
}
