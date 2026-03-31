import type { Media } from "@workspace/contracts/media";
import type { CreatePost, Post } from "@workspace/contracts/post";
import type { CreateTaggedCreator } from "@workspace/contracts/post-tag";
import { eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { v7 as uuidV7 } from "uuid";
import { db } from "@/core/db";
import { creators } from "../creator/schema";
import { media } from "../media/schema";
import { normalizeMedia } from "../media/service";
import { posts, postTaggedCreators } from "./schema";

export async function addPosts(data: CreatePost[]) {
  // 1. Deduplicate
  const uniquePosts = Array.from(
    new Map(data.map((post) => [`${post.platform}:${post.externalId}`, post])).values(),
  );
  if (uniquePosts.length === 0) return;

  // 2. Get creators
  const externalCreatorIds = uniquePosts.map((post) => post.externalCreatorId);
  const uniqueExternalCreatorIds = Array.from(new Set(externalCreatorIds));
  const creatorIds = await db
    .select({ id: creators.id, externalId: creators.externalId })
    .from(creators)
    .where(inArray(creators.externalId, uniqueExternalCreatorIds));

  const creatorIdMap = new Map(creatorIds.map((c) => [c.externalId, c.id]));

  // 3. Filter already existing posts (single query)
  const existingPosts = await db
    .select({ externalId: posts.externalId, platform: posts.platform })
    .from(posts)
    .where(
      inArray(
        posts.externalId,
        uniquePosts.map((p) => p.externalId),
      ),
    );

  const existingSet = new Set(existingPosts.map((p) => `${p.platform}:${p.externalId}`));
  const newPosts = uniquePosts.filter((p) => !existingSet.has(`${p.platform}:${p.externalId}`));
  if (newPosts.length === 0) return;

  // 4. Prepare base insert data
  const now = new Date();
  const prepared = newPosts.map((post) => {
    const creatorId = creatorIdMap.get(post.externalCreatorId);

    if (!creatorId) {
      throw new Error(`Creator not found for externalId: ${post.externalCreatorId}`);
    }

    return {
      id: uuidV7(),
      platform: post.platform,
      externalId: post.externalId,
      url: post.url,
      createdAt: post.createdAt ?? now,
      updatedAt: now,
      metadata: post.metadata,
      creatorId,
      caption: post.caption,
      externalQuotedPostId: post.externalQuotedPostId ?? null, // temp field
      quotedPostId: null as string | null,
    };
  });

  // 5. Resolve quoted posts (existing in DB)
  const quotedExternalIds = prepared.map((p) => p.externalQuotedPostId).filter(Boolean) as string[];

  let quotedMap = new Map<string, string>();

  if (quotedExternalIds.length > 0) {
    const quotedPosts = await db
      .select({ id: posts.id, externalId: posts.externalId })
      .from(posts)
      .where(inArray(posts.externalId, quotedExternalIds));

    quotedMap = new Map(quotedPosts.map((p) => [p.externalId, p.id]));
  }

  // 6. Local map (same batch references)
  const localMap = new Map(prepared.map((p) => [p.externalId, p.id]));

  // 7. Attach quotedPostId
  const finalData = prepared.map((p) => {
    let quotedPostId: string | null = null;

    if (p.externalQuotedPostId) {
      quotedPostId =
        localMap.get(p.externalQuotedPostId) || quotedMap.get(p.externalQuotedPostId) || null;
    }

    return {
      ...p,
      quotedPostId,
      externalQuotedPostId: undefined, // remove temp field
    };
  });

  // 8. Bulk insert
  await db.insert(posts).values(finalData);
}

export async function addTaggedCreators(data: CreateTaggedCreator[]) {
  const externalCreatorIds = data.map((tag) => tag.externalCreatorId);
  const uniqueExternalCreatorIds = Array.from(new Set(externalCreatorIds));

  const creatorIds = await db
    .select({ id: creators.id, externalId: creators.externalId })
    .from(creators)
    .where(inArray(creators.externalId, uniqueExternalCreatorIds));

  const creatorIdMap = new Map(creatorIds.map((c) => [c.externalId, c.id]));

  const postExternalIds = data.map((tag) => tag.externalPostId);
  const uniquePostExternalIds = Array.from(new Set(postExternalIds));

  const postIds = await db
    .select({ id: posts.id, externalId: posts.externalId })
    .from(posts)
    .where(inArray(posts.externalId, uniquePostExternalIds));

  const postIdMap = new Map(postIds.map((p) => [p.externalId, p.id]));

  for (const tag of data) {
    const postId = postIdMap.get(tag.externalPostId);
    const creatorId = creatorIdMap.get(tag.externalCreatorId);

    if (!postId) {
      throw new Error(`Post not found for externalId: ${tag.externalPostId}`);
    }
    if (!creatorId) {
      throw new Error(`Creator not found for externalId: ${tag.externalCreatorId}`);
    }

    await db
      .insert(postTaggedCreators)
      .values({
        creatorId: creatorId,
        postId: postId,
        x: tag.x,
        y: tag.y,
      })
      .onConflictDoNothing();
  }
}

export async function fetchPost(id: string): Promise<(Post & { quotedPost?: Post }) | null> {
  const [post] = await db
    .select({
      ...getTableColumns(posts),
      creator: creators,
      media: sql<Media[]>`
      (
        SELECT COALESCE(json_agg(${media}), '[]'::json)
        FROM ${media}
        WHERE ${media.referenceId} = ${posts.id}
      )`,
    })
    .from(posts)
    .innerJoin(creators, eq(creators.id, posts.creatorId))
    .where(eq(posts.id, id))
    .limit(1);

  if (!post) return null;

  const quotedPost = post.quotedPostId ? await fetchPost(post.quotedPostId) : null;

  return {
    ...post,
    creator: {
      ...post.creator,
      verified: post.creator.verified || undefined,
      name: post.creator.name || undefined,
      avatar: `${post.creator.platform}/avatar/${post.creator.externalId}.jpg`,
    },
    media: normalizeMedia(post.media),
    quotedPostId: post.quotedPostId || undefined,
    quotedPost: quotedPost || undefined,
    tags: [],
    collectionId: post.collectionId || undefined,
    note: post.note || undefined,
    rate: post.rate || undefined,
    caption: post.caption || undefined,
    deletedAt: post.deletedAt || undefined,
    favorite: post.favorite || undefined,
  };
}
