import type { FilePath } from "@/features/file-manager/service";
import type { ParsedTiktokPost } from "../schemas";

type MediaType = "image" | "video" | "user" | "music";

export function getImagePath(folder: MediaType, id: string | number) {
  return `tiktok/${folder}/${id}.jpg` as FilePath;
}

export function getVideoPath(folder: MediaType, id: string | number) {
  return `tiktok/${folder}/${id}.mp4` as FilePath;
}

export function getMusicPath(folder: MediaType, id: string | number) {
  return `tiktok/${folder}/${id}.mp3` as FilePath;
}

export function getPlaceholderPath(path: string) {
  return path
    .replace("user", "placeholder")
    .replace("image", "placeholder")
    .replace("video", "placeholder")
    .replace("music", "placeholder");
}

export function getFilePaths(post: ParsedTiktokPost) {
  const arr: { url: string; path: FilePath }[] = [];
  const { postId, creator, media, music } = post;

  // creator
  if (creator.profilePicture) {
    arr.push({ url: creator.profilePicture, path: getImagePath("user", creator.username) });
  }

  if (music.cover) {
    arr.push({ url: music.cover, path: getImagePath("music", music.id) });
  }
  if (music.url) {
    arr.push({ url: music.url, path: getMusicPath("music", music.id) });
  }

  media.forEach((m, i) => {
    if (m.mediaType === "image") {
      arr.push({ url: m.url, path: getImagePath("image", `${postId}-${i}`) });
    }
    if (m.mediaType === "video") {
      arr.push({ url: m.url, path: getVideoPath("video", `${postId}-${i}`) });
      arr.push({
        url: m.thumbnail,
        path: getImagePath("video", `${postId}-${i}`),
      });
    }
  });

  return arr;
}
