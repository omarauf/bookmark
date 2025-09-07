import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { env } from "@/config/env";
import type { AppRouterClient } from "../../../server/src/routers/common";

const link = new RPCLink({
  url: `${env.VITE_SERVER_URL}/rpc`,
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const client = createORPCClient<AppRouterClient>(link);
