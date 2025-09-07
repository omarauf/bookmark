import { env } from "@/config/env";

export function staticFile(path: string) {
  var p = path.replace(".mp4", "/mp4");
  p = p.replace(".jpg", "/jpg");
  return `${env.VITE_SERVER_URL}/api/files/${p}`;
}
