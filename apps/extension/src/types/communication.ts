export type CommunicationMessage = {
  platform: "instagram";
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
