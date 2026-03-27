import { type CreateCreator, CreatorSchemas } from "@workspace/contracts/creator";
import type { CreateDownloadTask } from "@workspace/contracts/download-task";
import type { Platform } from "@workspace/contracts/platform";
import { type CreatePost, PostSchemas } from "@workspace/contracts/post";
import type { Twitter } from "@workspace/contracts/raw/twitter";
import { type CreateTwitterPost, TwitterSchemas } from "@workspace/contracts/twitter";
import fs from "fs/promises";
import z from "zod";
import type { PlatformHandler, PostImportEntities } from "@/core/platform";
import { postParser } from "./parser/post";

export class TwitterHandler implements PlatformHandler<CreateTwitterPost> {
  platform: Platform = "twitter";

  _process(data: string) {
    const jsonData = JSON.parse(data) as Twitter[];

    const parsedPosts = jsonData.flatMap((bookmark) =>
      bookmark.data.bookmark_timeline_v2.timeline.instructions.flatMap((instruction) =>
        instruction.entries.flatMap((entry) => {
          if (entry.content.itemContent === undefined) return [];
          if (Object.keys(entry.content.itemContent.tweet_results).length === 0) return [];
          return postParser(entry.content.itemContent.tweet_results);
        }),
      ),
    );

    const valid: CreateTwitterPost[] = [];
    const invalid: CreateTwitterPost[] = [];

    for (const post of parsedPosts) {
      const result = TwitterSchemas.post.safeParse(post);
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

  parse(data: string): CreateTwitterPost[] {
    const { valid } = this._process(data);
    return valid;
  }

  map(data: CreateTwitterPost[]): PostImportEntities {
    const creators = this.mapCreator(data);
    const posts = this.mapPost(data);
    const mediaDownloadTasks = this.mapMedia(data, creators);

    return {
      creators: creators,
      posts: posts,
      postTaggedCreators: [],
      media: mediaDownloadTasks,
    };
  }

  mapQuotedPost(posts: CreateTwitterPost[]) {
    const quotedRelations: { externalPostId: string; externalQuotedId: string }[] = [];

    for (const post of posts) {
      if (post.externalQuotedPostId === undefined) continue;

      quotedRelations.push({
        externalPostId: post.externalId,
        externalQuotedId: post.externalQuotedPostId,
      });
    }

    return quotedRelations;
  }

  mapMedia(posts: CreateTwitterPost[], creators: CreateCreator[]): CreateDownloadTask[] {
    const mediaDownloadTasks: CreateDownloadTask[] = [];

    for (const creator of creators) {
      if (!creator.avatar) continue;
      mediaDownloadTasks.push({
        url: creator.avatar,
        platform: "twitter",
        type: "image",
        externalId: creator.externalId,
        referenceType: "creator",
        key: `twitter/avatar/${creator.externalId}.jpg`,
      });
    }

    for (const post of posts) {
      post.media.forEach((mediaItem, i) => {
        const commonProps = {
          platform: "twitter",
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
            key: `twitter/post/${post.externalId}-${i}.jpg`,
          });
        }

        if (mediaItem.mediaType === "video") {
          mediaDownloadTasks.push({
            ...commonProps,
            url: mediaItem.url,
            type: "video",
            duration: mediaItem.duration,
            key: `twitter/post/${post.externalId}-${i}.mp4`,
          });

          // Push video thumbnail as image
          mediaDownloadTasks.push({
            ...commonProps,
            url: mediaItem.thumbnail,
            type: "image",
            key: `twitter/post/${post.externalId}-${i}.jpg`,
          });
        }
      });
    }

    return mediaDownloadTasks;
  }

  mapPost(data: CreateTwitterPost[]): CreatePost[] {
    const posts: CreatePost[] = data.map((post) => {
      const { creator, createdAt, ...rest } = post;

      return {
        ...rest,
        platform: "twitter",
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
      throw new Error("Failed to map Twitter posts due to validation errors.");
    }

    return validPosts.data;
  }

  mapCreator(data: CreateTwitterPost[]): CreateCreator[] {
    const creators: CreateCreator[] = data.map((post) => {
      const { createdAt, ...rest } = post.creator;

      return {
        ...rest,
        platform: "twitter",
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        metadata: {
          ...rest,
        },
      };
    });

    const validCreators = CreatorSchemas.create.array().safeParse(creators);
    if (!validCreators.success) {
      console.error("Invalid creators:", validCreators.error);
      throw new Error("Failed to map Twitter creators due to validation errors.");
    }

    return validCreators.data;
  }
}
