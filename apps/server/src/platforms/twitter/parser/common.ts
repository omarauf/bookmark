import type {
  FluffyUserResults,
  PurpleUserResults,
  StickyUserResults,
  TweetResults,
} from "@workspace/contracts/raw/twitter";

export function getUsername(creator: FluffyUserResults | PurpleUserResults | StickyUserResults) {
  return creator.result.core.screen_name;
}

export function getTweet(tweet: TweetResults) {
  if (tweet?.result?.tweet) {
    return tweet.result.tweet;
  }

  if (tweet.result) {
    return tweet.result;
  }

  throw new Error("Unable to parse tweet");
}

export function getCreator(tweet: TweetResults) {
  if (tweet?.result?.tweet) {
    return tweet.result.tweet.core.user_results;
  }

  if (tweet.result?.core) {
    return tweet.result.core.user_results;
  }

  throw new Error("Unable to parse creator");
}
