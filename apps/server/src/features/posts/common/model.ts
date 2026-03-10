import { InstagramPostModel } from "../instagram/models/post";
import { TiktokPostModel } from "../tiktok/models/post";
import { TwitterPostModel } from "../twitter/models/post";

export const models = {
  instagram: InstagramPostModel,
  twitter: TwitterPostModel,
  tiktok: TiktokPostModel,
};
