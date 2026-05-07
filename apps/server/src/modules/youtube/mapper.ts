import type { YoutubeMetadata } from "@workspace/contracts/youtube";
import type { YoutubeVideo } from "./integrations/type";

export function getYoutubeMetadata(data: YoutubeVideo): YoutubeMetadata {
  const video = data.items[0];

  if (!video) {
    throw new Error("No video found in YouTube API response");
  }

  const largestThumbnail = getLargestThumbnailUrl(video.snippet.thumbnails);

  if (!largestThumbnail) {
    throw new Error("No thumbnails found for YouTube video");
  }

  return {
    platform: "youtube",
    kind: "video",
    // title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: largestThumbnail,
    categoryId: video.snippet.categoryId,
    channelId: video.snippet.channelId,
    channelTitle: video.snippet.channelTitle,
    publishedAt: new Date(video.snippet.publishedAt),
    comments: parseInt(video.statistics.commentCount, 10),
    likes: parseInt(video.statistics.likeCount, 10),
    views: parseInt(video.statistics.viewCount, 10),
    duration: parseDuration(video.contentDetails.duration),
    tags: video.snippet.tags || [],
  };
}

type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

type Thumbnails = Record<string, Thumbnail>;

function getLargestThumbnailUrl(thumbnails: Thumbnails) {
  let bestUrl: string | undefined;
  let maxArea = 0;

  for (const key in thumbnails) {
    const thumb = thumbnails[key];
    const area = thumb.width * thumb.height;

    if (area > maxArea) {
      maxArea = area;
      bestUrl = thumb.url;
    }
  }

  return bestUrl;
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return 0;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}
