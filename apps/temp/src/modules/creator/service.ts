import type { CreateCreator } from "@workspace/contracts/creator";
import { db } from "@/core/db";
import { creators } from "./schema";

export async function addCreators(data: CreateCreator[]) {
  if (data.length < 1) {
    return [];
  }

  const uniqueCreators = Array.from(
    new Map(data.map((creator) => [`${creator.platform}:${creator.externalId}`, creator])).values(),
  );

  const rows = await Promise.all(
    uniqueCreators.map(async (creator) => {
      const result = await db
        .insert(creators)
        .values({
          platform: creator.platform,
          externalId: creator.externalId,
          url: creator.url,
          username: creator.username,
          name: creator.name,
          verified: creator.verified,
          createdAt: creator.createdAt,
          metadata: creator.metadata,
        })
        .onConflictDoUpdate({
          target: [creators.platform, creators.externalId],
          set: {
            url: creator.url,
            username: creator.username,
            name: creator.name ?? null,
            verified: creator.verified,
            metadata: creator.metadata,
          },
        })
        .returning();

      return result[0];
    }),
  );

  return rows;
}
