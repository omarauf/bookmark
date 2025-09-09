import type { PlatformType } from "@workspace/contracts/platform-type";

export type CommunicationMessage = {
  platform: PlatformType;
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
