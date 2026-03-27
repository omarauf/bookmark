import type { CreateCreator } from "@workspace/contracts/creator";
import type { CreateDownloadTask } from "@workspace/contracts/download-task";
import type { Platform } from "@workspace/contracts/platform";
import type { CreateBasePost, CreatePost } from "@workspace/contracts/post";
import type { CreateTaggedCreator } from "@workspace/contracts/post-tag";

export type PostImportEntities = {
  posts: CreatePost[];
  creators: CreateCreator[];
  postTaggedCreators: CreateTaggedCreator[];
  media: CreateDownloadTask[];
};

export interface PlatformHandler<T extends CreateBasePost = CreateBasePost> {
  platform: Platform;

  validate(data: string): { valid: number; invalid: number };

  parse(data: string): T[];

  // TODO: find better name for this, it's not really mapping since it also creates download jobs for media
  map(post: T[]): PostImportEntities;
}
