// import { createIsomorphicFn } from "@tanstack/react-start";
import { env } from "@/config/env";

// export const serverUrl = createIsomorphicFn()
//   .server(() => env.SERVER_URL)
//   .client(() => env.VITE_API_URL);

// export function staticFile(path: string) {
//   var p = path.replace(".mp4", "/mp4");
//   p = p.replace(".jpg", "/jpg");
//   return `${serverUrl()}/api/files/${p}`;
// }

export function staticFile(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${env.VITE_S3_URL}/${path}`;
}
