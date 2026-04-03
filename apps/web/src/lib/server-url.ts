import { createIsomorphicFn } from "@tanstack/react-start";
import { env } from "@/config/env";

export const serverUrl = createIsomorphicFn()
  .server(() => env.SERVER_URL)
  .client(() => env.VITE_API_URL);
