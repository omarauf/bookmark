import type {
  CunningResult,
  FluffyTweet,
  TweetResults,
  TweetResultsResult,
} from "@workspace/contracts/raw/twitter";
import type { CreateTwitterPost } from "@workspace/contracts/twitter";
import { creatorParser } from "./creator";
import { mediaParser } from "./media";

export function postParser(post: TweetResults): CreateTwitterPost[] {
  const parsedPosts: CreateTwitterPost[] = [];

  // let parsedPost: CreateTwitterPost | undefined;

  if (post?.result?.tweet) {
    const parsedPost = tweetParser(post.result.tweet);
    parsedPosts.push(parsedPost);
  }

  if (post.result?.core) {
    const parsedPost = coreParser(post.result);
    parsedPosts.push(parsedPost);
  }

  if (parsedPosts.length !== 1) {
    throw new Error("Unable to parse tweet");
  }

  if (post.result?.quoted_status_result?.result) {
    const q = post.result.quoted_status_result.result;

    if (q.tombstone === undefined) {
      // parsedPost.quoted = coreParser(q);
      const quotedPost = coreParser(q);
      parsedPosts.push(quotedPost);
      parsedPosts[0].externalQuotedPostId = quotedPost.externalId;
    }
  }

  return parsedPosts;
}

function tweetParser(tweet: FluffyTweet): CreateTwitterPost {
  const creator = creatorParser(tweet.core.user_results);
  const postId = tweet.rest_id;
  const url = `https://x.com/${creator.username}/status/${postId}`;
  const createdAt = new Date(tweet.legacy.created_at);

  const media = tweet.legacy.extended_entities?.media.map(mediaParser) || [];

  return {
    externalId: postId,
    url,
    createdAt,
    creator: creator,
    caption: tweet.legacy.full_text.replace(/https:\/\/t\.co\/\S+/g, ""),
    media: media,
    externalCreatorId: creator.externalId,
    videoDescription: tweet.post_video_description,
    imageDescription: tweet.post_image_description,
    views: Number(tweet.views.count || 0),
    likes: Number(tweet.legacy.favorite_count || 0),
    quotes: Number(tweet.legacy.quote_count || 0),
    replies: Number(tweet.legacy.reply_count || 0),
    retweets: Number(tweet.legacy.retweet_count || 0),
    bookmarks: Number(tweet.legacy.bookmark_count || 0),
    // quoted: undefined,
    externalQuotedPostId: undefined,
    platform: "twitter",
    collections: [],
    tags: [],
  };
}

function coreParser(result: TweetResultsResult | CunningResult): CreateTwitterPost {
  if (result.core === undefined || result.legacy === undefined || result.rest_id === undefined) {
    throw new Error("Invalid tweet result");
  }

  const creator = creatorParser(result.core.user_results);
  const postId = result.rest_id;
  const url = `https://x.com/${creator.username}/status/${postId}`;
  const createdAt = new Date(result.legacy.created_at);

  const media = result.legacy.extended_entities?.media.map(mediaParser) || [];

  return {
    externalId: postId,
    url,
    createdAt,
    creator: creator,
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
    // quoted: undefined,
    externalQuotedPostId: undefined,
    platform: "twitter",
    collections: [],
    tags: [],
    externalCreatorId: creator.externalId,
  };
}
