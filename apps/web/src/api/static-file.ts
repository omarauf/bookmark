import { env } from "@/config/env";

export function staticFile(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${env.VITE_S3_URL}/${path}`;
}
