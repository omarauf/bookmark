import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { AppRouterClient } from "server/route";
import { env } from "@/config/env";

const link = new RPCLink({
  url: `${env.VITE_SERVER_URL}/rpc`,
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const client = createORPCClient<AppRouterClient>(link);
