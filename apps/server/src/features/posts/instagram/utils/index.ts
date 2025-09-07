import type { ParsedInstagramPost } from "@workspace/contracts/instagram/post";
import type { FilePath } from "@/features/file-manager/service";

type MediaType = "image" | "video" | "carousel" | "user";

export function getImagePath(folder: MediaType, id: string | number) {
  return `instagram/${folder}/${id}.jpg` as FilePath;
}

export function getVideoPath(folder: MediaType, id: string | number) {
  return `instagram/${folder}/${id}.mp4` as FilePath;
}

export function getPlaceholderPath(path: string) {
  return path
    .replace("user", "placeholder")
    .replace("image", "placeholder")
    .replace("video", "placeholder")
    .replace("carousel", "placeholder");
}

export function getFilePaths(post: ParsedInstagramPost) {
  const arr: { url: string; path: FilePath }[] = [];
  const { postId, creator, userTags, media } = post;

  // creator
  if (creator.profilePicture) {
    arr.push({ url: creator.profilePicture, path: getImagePath("user", creator.username) });
  }

  // tagged users
  for (const tags of userTags) {
    if (tags.user?.profilePicture) {
      arr.push({ url: tags.user.profilePicture, path: getImagePath("user", tags.user.username) });
    }
  }

  if (media.mediaType === "image") {
    arr.push({ url: media.url, path: getImagePath("image", postId) });
  }

  //
  else if (media.mediaType === "video") {
    arr.push({ url: media.url, path: getVideoPath("video", postId) });
    arr.push({ url: media.thumbnail, path: getImagePath("video", postId) });
  }

  //
  else if (media.mediaType === "carousel") {
    media.media.forEach((m, i) => {
      if (m.mediaType === "image") {
        arr.push({ url: m.url, path: getImagePath("carousel", `${postId}-${i}`) });
      }

      //
      else {
        arr.push({ url: m.url, path: getVideoPath("carousel", `${postId}-${i}`) });
        arr.push({ url: m.thumbnail, path: getImagePath("carousel", `${postId}-${i}`) });
      }
    });
  }

  return arr;
}
