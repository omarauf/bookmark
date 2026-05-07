import { env } from "@/config/env";
import type { YoutubeVideo } from "./type";

async function getByVideoId(
  videoId: string,
): Promise<[YoutubeVideo, undefined] | [undefined, string]> {
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("key", env.YOUTUBE_API_KEY);
  url.searchParams.set("id", videoId);
  url.searchParams.set("part", "snippet,statistics,contentDetails");

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return [undefined, `YouTube API error: ${res.status} ${res.statusText}`];
  }

  const data = (await res.json()) as YoutubeVideo;
  return [data, undefined];
}

export const youtubeClient = {
  getByVideoId,
};
