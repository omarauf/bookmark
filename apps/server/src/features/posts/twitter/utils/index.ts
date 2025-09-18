import type { FilePath } from "@/features/file-manager/service";
import type { ParsedTwitterPost } from "../schemas";

type MediaType = "image" | "video" | "user";

export function getImagePath(folder: MediaType, id: string | number) {
  return `twitter/${folder}/${id}.jpg` as FilePath;
}

export function getVideoPath(folder: MediaType, id: string | number) {
  return `twitter/${folder}/${id}.mp4` as FilePath;
}

export function getPlaceholderPath(path: string) {
  return path
    .replace("user", "placeholder")
    .replace("image", "placeholder")
    .replace("video", "placeholder");
}

export function getFilePaths(post: ParsedTwitterPost) {
  const arr: { url: string; path: FilePath }[] = [];
  const { postId, creator, media, quoted } = post;

  // creator
  if (creator.profilePicture) {
    arr.push({ url: creator.profilePicture, path: getImagePath("user", creator.username) });
  }

  if (quoted?.creator) {
    if (quoted.creator.profilePicture) {
      arr.push({
        url: quoted.creator.profilePicture,
        path: getImagePath("user", quoted.creator.username),
      });
    }

    const quotedPostId = quoted.postId;
    quoted.media.forEach((m, i) => {
      if (m.mediaType === "image") {
        arr.push({ url: m.url, path: getImagePath("image", `${quotedPostId}-${i}`) });
      }
      if (m.mediaType === "video") {
        arr.push({ url: m.url, path: getVideoPath("video", `${quotedPostId}-${i}`) });
        arr.push({
          url: m.thumbnail,
          path: getImagePath("video", `${quotedPostId}-${i}`),
        });
      }
      if (m.mediaType === "gif") {
        arr.push({ url: m.url, path: getVideoPath("video", `${quotedPostId}-${i}`) });
        arr.push({
          url: m.thumbnail,
          path: getImagePath("video", `${quotedPostId}-${i}`),
        });
      }
    });
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
    if (m.mediaType === "gif") {
      arr.push({ url: m.url, path: getVideoPath("video", `${postId}-${i}`) });
      arr.push({
        url: m.thumbnail,
        path: getImagePath("video", `${postId}-${i}`),
      });
    }
  });

  return arr;
}
