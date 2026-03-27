import { type CreateCreator, CreatorSchemas } from "@workspace/contracts/creator";
import type { CreateDownloadTask } from "@workspace/contracts/download-task";
import { type CreateInstagramPost, InstagramSchemas } from "@workspace/contracts/instagram";
import type { Platform } from "@workspace/contracts/platform";
import { type CreatePost, PostSchemas } from "@workspace/contracts/post";
import { type CreateTaggedCreator, TaggedCreatorSchemas } from "@workspace/contracts/post-tag";
import type { Instagram } from "@workspace/contracts/raw/instagram";
import z from "zod";
import type { PlatformHandler, PostImportEntities } from "@/core/platform";
import { postParser } from "./parser/post";

export class InstagramHandler implements PlatformHandler<CreateInstagramPost> {
  platform: Platform = "instagram";

  _process(data: string) {
    const jsonData = JSON.parse(data) as Instagram[];

    const parsedPosts = jsonData.flatMap((post) =>
      post.items.map((item) => postParser(item.media)),
    );

    const valid: CreateInstagramPost[] = [];
    const invalid: CreateInstagramPost[] = [];

    for (const post of parsedPosts) {
      const result = InstagramSchemas.post.safeParse(post);
      if (result.success) valid.push(post);
      else {
        const pretty = z.prettifyError(result.error);
        console.error(pretty);
        invalid.push(post);
      }
    }

    return { valid: valid, invalid: invalid.length };
  }

  validate(data: string): { valid: number; invalid: number } {
    const { valid, invalid } = this._process(data);
    return { valid: valid.length, invalid };
  }

  parse(data: string): CreateInstagramPost[] {
    const { valid } = this._process(data);
    return valid;
  }

  map(data: CreateInstagramPost[]): PostImportEntities {
    const creators = this.mapCreator(data);
    const postCreatorTags = this.mapTaggedCreator(data);
    const posts = this.mapPost(data);
    const mediaDownloadTasks = this.mapMedia(data, creators);

    return {
      creators: creators,
      posts: posts,
      postTaggedCreators: postCreatorTags,
      media: mediaDownloadTasks,
    };
  }

  mapMedia(posts: CreateInstagramPost[], creators: CreateCreator[]): CreateDownloadTask[] {
    const mediaDownloadTasks: CreateDownloadTask[] = [];

    for (const creator of creators) {
      if (!creator.avatar) continue;
      mediaDownloadTasks.push({
        url: creator.avatar,
        platform: "instagram",
        type: "image",
        externalId: creator.externalId,
        referenceType: "creator",
        key: `instagram/avatar/${creator.externalId}.jpg`,
      });
    }

    for (const post of posts) {
      post.media.forEach((mediaItem, i) => {
        const commonProps = {
          platform: "instagram",
          externalId: post.externalId,
          referenceType: "post",
          height: mediaItem.height,
          width: mediaItem.width,
        } as const;

        if (mediaItem.mediaType === "image") {
          mediaDownloadTasks.push({
            ...commonProps,
            url: mediaItem.url,
            type: "image",
            key: `instagram/post/${post.externalId}-${i}.jpg`,
          });
        }

        if (mediaItem.mediaType === "video") {
          mediaDownloadTasks.push({
            ...commonProps,
            url: mediaItem.url,
            type: "video",
            duration: mediaItem.duration,
            key: `instagram/post/${post.externalId}-${i}.mp4`,
          });

          // Push video thumbnail as image
          mediaDownloadTasks.push({
            ...commonProps,
            url: mediaItem.thumbnail,
            type: "image",
            key: `instagram/post/${post.externalId}-${i}.jpg`,
          });
        }
      });
    }

    return mediaDownloadTasks;
  }

  mapTaggedCreator(data: CreateInstagramPost[]): CreateTaggedCreator[] {
    const taggedCreators: CreateTaggedCreator[] = data.flatMap((post) =>
      post.taggedCreators.map((userTag) => ({
        externalCreatorId: userTag.user.externalId,
        externalPostId: post.externalId,
        x: userTag.x,
        y: userTag.y,
      })),
    );

    const validPostCreatorTags = TaggedCreatorSchemas.create.array().safeParse(taggedCreators);
    if (!validPostCreatorTags.success) {
      console.error("Invalid post creator tags:", validPostCreatorTags.error);
      throw new Error("Failed to map Instagram post creator tags due to validation errors.");
    }

    return validPostCreatorTags.data;
  }

  mapPost(data: CreateInstagramPost[]): CreatePost[] {
    const posts: CreatePost[] = data.map((post) => {
      const { creator, createdAt, ...rest } = post;

      return {
        ...rest,
        platform: "instagram",
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        externalCreator: creator.externalId,
        metadata: {
          ...rest,
        },
      };
    });

    const validPosts = PostSchemas.create.array().safeParse(posts);
    if (!validPosts.success) {
      console.error("Invalid posts:", validPosts.error);
      throw new Error("Failed to map Instagram posts due to validation errors.");
    }

    return validPosts.data;
  }

  mapCreator(data: CreateInstagramPost[]): CreateCreator[] {
    const creators: CreateCreator[] = data
      .flatMap((post) => [post.creator, ...post.taggedCreators.map((userTag) => userTag.user)])
      .map((creator) => {
        const { createdAt, ...rest } = creator;

        return {
          ...rest,
          platform: "instagram",
          createdAt: createdAt ? new Date(createdAt) : new Date(),
          metadata: {
            ...rest,
          },
        };
      });

    const validCreators = CreatorSchemas.create.array().safeParse(creators);
    if (!validCreators.success) {
      console.error("Invalid creators:", validCreators.error);
      throw new Error("Failed to map Instagram creators due to validation errors.");
    }

    return validCreators.data;
  }
}
