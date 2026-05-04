import type { Music } from "@workspace/contracts/raw/tiktok";
import type { TiktokMusic } from "@workspace/contracts/tiktok";

export function musicParser(music: Music): TiktokMusic {
  return {
    id: music.id,
    title: music.title,
    authorName: music.authorName,
    original: music.original,
    // cover: music.coverLarge,
    album: music.album,
    duration: music.duration,
    // url: music.playUrl,
  };
}
