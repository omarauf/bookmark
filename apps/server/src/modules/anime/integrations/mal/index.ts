import { env } from "@/config/env";
import type { MalAnimeDetails } from "./type";

const MAL_CLIENT_ID = env.MAL_CLIENT_ID;

const fields = [
  "id",
  "title",
  "main_picture",
  "alternative_titles",
  "start_date",
  "end_date",
  "synopsis",
  "mean",
  "rank",
  "popularity",
  "num_list_users",
  "num_scoring_users",
  "nsfw",
  "created_at",
  "updated_at",
  "media_type",
  "status",
  "genres",
  "num_episodes",
  "start_season",
  "broadcast",
  "source",
  "average_episode_duration",
  "rating",
  "pictures",
  "background",
  "related_anime",
  "related_manga",
  "recommendations",
  "studios",
  "statistics",
].join(",");

async function getByAnimeId(
  animeId: string,
): Promise<[MalAnimeDetails, undefined] | [undefined, string]> {
  const res = await fetch(`https://api.myanimelist.net/v2/anime/${animeId}?fields=${fields}`, {
    headers: {
      "X-MAL-CLIENT-ID": MAL_CLIENT_ID,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return [undefined, `MAL API error: ${res.status} ${res.statusText}`];
  }

  const data = (await res.json()) as MalAnimeDetails;
  return [data, undefined];
}

export const malClient = {
  getByAnimeId,
};
