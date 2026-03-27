import type { Platform } from "@workspace/contracts/platform";

export type CommunicationMessage = {
  platform: Platform;
  type: "scrape" | "unsave";
  count?: number;
  download?: boolean;
  send?: boolean;
};

export type CommunicationResponse<T = object, U = string> = {
  status: "success" | "error";
  data?: T;
  error?: U;
};
